import React, { useState, useEffect } from 'react';
import { useGetToken } from '../hooks/get-token';
import { useSelector } from 'react-redux';
import { getClientId } from '../stores/client/clientSelectors';
import http from '../services/http';
import { apis } from '../constants/api-routes';
import Table from 'react-bootstrap/Table';
import DatePicker from 'react-datepicker';

function diffInHours(dt2, dt1) {
  let diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  const df = Math.abs(Math.round(diff));

  return parseFloat(df / 60);
}

function TimeTrackingContainer() {
  let token = useGetToken();
  const clientId = useSelector(getClientId);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tt, setTT] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await http.get(
          apis.timetracking,
          { clientId, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
          token,
        );
        let all = 0;
        const transformedData = data.reduce((prev, current) => {
          const hoursWorked = diffInHours(current.startDate, current.endDate);
          const user = prev.find((v) => v.employeeId === current.employeeId);
          if (user) {
            user.hours = user.hours + hoursWorked;
            const addition = parseFloat(hoursWorked * current.ratePerHour);
            user.total = parseFloat(user.total) + addition;
            all += addition;
            user.records.push({
              endDate: current.endDate,
              startDate: current.startDate,
              ratePerHour: current.ratePerHour,
            });
            return prev;
          }
          all += parseFloat(hoursWorked * current.ratePerHour);
          return [
            ...prev,
            {
              ...current,
              records: [
                {
                  endDate: current.endDate,
                  startDate: current.startDate,
                  ratePerHour: current.ratePerHour,
                },
              ],
              hours: hoursWorked,
              total: parseFloat(hoursWorked * current.ratePerHour),
            },
          ];
        }, []);
        setTotal(all);
        setTT(transformedData);
      } catch (e) {
        setError(e);
      }
    }
    fetchData();
  }, [token, clientId, startDate, endDate]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h4>Таймтрекінг</h4>
          <p>
            Від <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            До <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          </p>
          <Table className="table-list">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Кількість годин</th>
                <th>Нарахування</th>
              </tr>
            </thead>
            <tbody>
              {tt.map(({ employeeName, employeeId, hours, total }) => {
                return (
                  <tr key={employeeId}>
                    <td>{employeeName}</td>
                    <td>{hours.toFixed(2)}</td>
                    <td>{total.toFixed(2) + ' грн'}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <p>
            <b>Всього за період: {total}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

TimeTrackingContainer.defaultProps = {
  tt: [],
};

export default TimeTrackingContainer;
