import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useGetToken } from '../hooks/get-token';
import { getClientId, getVisits } from '../stores/client/clientSelectors';
import { fetchVisits } from './../stores/client/clientActions';
import DatePicker from 'react-datepicker';

function StatsContainer({ visits = [], fetchVisits, clientId }) {
  let token = useGetToken();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [zones, setZones] = useState([]);

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
    console.log(startDate.toISOString());
    if (clientId && token) {
      fetchVisits({ clientId, startDate: startDate.toISOString(), endDate: endDate.toISOString() }, token);
    }
  }, [clientId, fetchVisits, token, startDate, endDate]);

  return (
    <div className="container-fluid">
      <div className="row">
        Від <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        До <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        <p>
          Всього сканувань: {visits.filter(v => v.zone !== 'null').length}
        </p>
      </div>
      <div className="row">
        <div className="col">
          {visits &&
            visits.filter(v => v.zone !== 'null').map((v, index) => {
              return (
                <div key={'s' + index}>
                  <b>{v.zone}</b> {new Date(v.date).toDateString()}
                </div>
              );
            })}
        </div>
        <div className="col">
          {zones &&
            zones.filter(v => v.zone !== 'null').map((v, index) => {
              return (
                <div key={'asd' + index}>
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

export default connect(
  (state) => ({
    visits: getVisits(state),
    clientId: getClientId(state),
  }),
  {
    fetchVisits,
  },
)(StatsContainer);
