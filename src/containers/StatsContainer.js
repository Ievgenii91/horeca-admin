import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetToken } from '../hooks/get-token';
import { getClientId, getVisits } from '../stores/client/clientSelectors';
import { fetchVisits } from './../stores/client/clientActions';
import DatePicker from 'react-datepicker';
import { Alert } from 'react-bootstrap';

function StatsContainer() {
  let token = useGetToken();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [zones, setZones] = useState([]);
  const dispatch = useDispatch();
  const visits = useSelector(getVisits);
  const clientId = useSelector(getClientId);
  
  useEffect(() => {
    if (visits && visits.length) {
      setZones(
        visits.reduce((acc, val) => {
          const existing = acc.find((v) => v.zone === val.zone);
          if (existing) {
            existing.dates.push(val.date);
            return acc;
          }
          return [...acc, { zone: val.zone, dates: [val.date] }];
        }, []),
      );
    } else {
      setZones([]);
    }
  }, [visits, setZones]);

  useEffect(() => {
    if (clientId && token) {
      dispatch(fetchVisits({ clientId, startDate: startDate.toISOString(), endDate: endDate.toISOString() }, token));
    }
  }, [clientId, token, startDate, endDate, dispatch]);

  return (
    <div className="container-fluid">
       <div className="row">
        <div className="col">
          <h4>Статистика сканів</h4>
        </div>
      </div>
      <div className="row text-center">
        <Alert variant="success">
          <Alert.Heading>Скани</Alert.Heading>
          <p>
            Від <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            До <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          </p>
          <hr />
          <p className="mb-0">
            Всього сканувань: {visits?.length}
          </p>
        </Alert>
      </div>
      <div className="row">
        <div className="col">
          {!!visits?.length &&
            visits.map((v) => {
              return (
                <div key={v._id}>
                  <b>{v.zone}</b> {new Date(v.date).toDateString()}
                  <p><small>{v.agent}</small></p>
                </div>
              );
            })}
        </div>
        <div className="col">
          {!!zones.length &&
            zones.map((v) => {
              return (
                <div key={v._id}>
                  Зона: <b>{v.zone}</b>&nbsp;
                  Сканувань: {v.dates.length}
                </div>
              );
            }).sort((a, b) => a.dates?.length < b.dates?.length ? -1 : 1 )}
        </div>
      </div>
    </div>
  );
}

export default StatsContainer;