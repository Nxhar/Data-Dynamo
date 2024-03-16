import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { useTable } from 'react-table';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import RightPane from '../CommunityForum/RightPane/RightPane';
import './analytics.css'

const MedicationsTable = ({ data, columns }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ marginTop: '20px' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AnalyticsDashboard = ({ user }) => {
  const userId = user.uid;
  const [chartData, setChartData] = useState({
    bodyTemperature: {
      options: {
        chart: {
          type: 'bar',
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: 'Body Temperature Over Days',
        },
      },
      series: [{
        name: 'Body Temperature',
        data: [],
      }],
    },
    heartRate: {
      options: {
        chart: {
          type: 'bar',
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: 'Heart Rate Over Days',
        },
      },
      series: [{
        name: 'Heart Rate',
        data: [],
      }],
    },
    caloricIntake: {
      options: {
        chart: {
          type: 'bar',
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: 'Caloric Intake Over Days',
        },
      },
      series: [{
        name: 'Caloric Intake',
        data: [],
      }],
    },
    sleepDuration: {
      options: {
        chart: {
          type: 'bar',
        },
        xaxis: {
          categories: [],
        },
        title: {
          text: 'Sleep Duration Over Days',
        },
      },
      series: [{
        name: 'Sleep Duration',
        data: [],
      }],
    },
  });

  const [tableData, setTableData] = useState({
    medications: [],
    symptoms: [],
  });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const userDocRef = doc(db, 'healthstatus', userId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const healthData = docSnapshot.data().data || [];

          // Format healthData for charts
          const categories = healthData.map(entry => entry.date);

          // Body Temperature chart data
          const bodyTemperatureData = healthData.map(entry => entry.bodyTemperature);
          setChartData(prevState => ({
            ...prevState,
            bodyTemperature: {
              ...prevState.bodyTemperature,
              options: {
                ...prevState.bodyTemperature.options,
                xaxis: {
                  categories,
                },
              },
              series: [{
                name: 'Body Temperature',
                data: bodyTemperatureData,
              }],
            },
          }));

          // Heart Rate chart data
          const heartRateData = healthData.map(entry => entry.heartRate);
          setChartData(prevState => ({
            ...prevState,
            heartRate: {
              ...prevState.heartRate,
              options: {
                ...prevState.heartRate.options,
                xaxis: {
                  categories,
                },
              },
              series: [{
                name: 'Heart Rate',
                data: heartRateData,
              }],
            },
          }));

          // Caloric Intake chart data
          const caloricIntakeData = healthData.map(entry => entry.caloricIntake);
          setChartData(prevState => ({
            ...prevState,
            caloricIntake: {
              ...prevState.caloricIntake,
              options: {
                ...prevState.caloricIntake.options,
                xaxis: {
                  categories,
                },
              },
              series: [{
                name: 'Caloric Intake',
                data: caloricIntakeData,
              }],
            },
          }));

          // Sleep Duration chart data
          const sleepDurationData = healthData.map(entry => entry.sleepDuration);
          setChartData(prevState => ({
            ...prevState,
            sleepDuration: {
              ...prevState.sleepDuration,
              options: {
                ...prevState.sleepDuration.options,
                xaxis: {
                  categories,
                },
              },
              series: [{
                name: 'Sleep Duration',
                data: sleepDurationData,
              }],
            },
          }));

          // Medications and Symptoms table data
          const medications = healthData.map(entry => ({ date: entry.date, medication: entry.medications }));
          const symptoms = healthData.map(entry => ({ date: entry.date, symptom: entry.symptoms }));
          setTableData({
            medications: medications.reverse(),
            symptoms: symptoms.reverse(),
          });
        } else {
          console.log('User document does not exist in Firestore.');
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchHealthData();
  }, [userId]);

  const medicationsColumns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Medication', accessor: 'medication' },
  ];

  const symptomsColumns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Symptom', accessor: 'symptom' },
  ];

  return (
    <>
      <div className='rightbg'>
        <h2 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>Health Analytics for: {user.displayName}</h2>

        {/* Body Temperature chart */}
        <div className='chart-container'>
          <ApexCharts options={chartData.bodyTemperature.options} series={chartData.bodyTemperature.series} type="bar" height={350} />
        </div>

        {/* Heart Rate chart */}
        <div className='chart-container'>
          <ApexCharts options={chartData.heartRate.options} series={chartData.heartRate.series} type="bar" height={350} />
        </div>

        {/* Caloric Intake chart */}
        <div className='chart-container'>
          <ApexCharts options={chartData.caloricIntake.options} series={chartData.caloricIntake.series} type="bar" height={350} />
        </div>

        {/* Sleep Duration chart */}
        <div className='chart-container'>
          <ApexCharts options={chartData.sleepDuration.options} series={chartData.sleepDuration.series} type="bar" height={350} />
        </div>

        {/* Medications table */}
        <div className='table-container'>
          <h3 style={{textAlign:'center', paddingTop:'20px', fontSize:'25px'}}>Medications</h3>
          <MedicationsTable data={tableData.medications} columns={medicationsColumns} />
        </div>

        {/* Symptoms table */}
        <div className='table-container'>
          <h3 style={{textAlign:'center', paddingTop:'20px', fontSize:'25px'}}> Symptoms</h3>
          <MedicationsTable data={tableData.symptoms} columns={symptomsColumns} />
        </div>
      </div>
      <RightPane user={user} context={''} />
    </>
  );
};

export default AnalyticsDashboard;
