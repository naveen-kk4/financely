import React , {useState,useEffect}from "react";
import "./styles.css"
import { Line,Pie } from '@ant-design/charts';
import{Select} from "antd";

const Charts = ({ sortedTransactions }) => {
  const [selectedOption, setSelectedOption] = useState('All');
  const[selectedMonth,setSelectedMonth] = useState("Month");
  const [width, setWidth] = useState(window.innerWidth);
  const lineChartWidth = width/2;

  // Function to update width state when the window is resized
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener('resize', updateWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []); // Empty dependency array ensures the effect runs only once


  if (!Array.isArray(sortedTransactions)) {
    console.error("sortedTransactions is not an array:", sortedTransactions);
    return null; // Render nothing if sortedTransactions is not an array
  }

  let finalTransactions = sortedTransactions;

  if (selectedOption === "Expenses") {
    finalTransactions = sortedTransactions.filter((transaction) => transaction.type === "expenses");
  } else if (selectedOption === "Income") {
    finalTransactions = sortedTransactions.filter((transaction) => transaction.type === "income");
  }


  switch(selectedMonth){

    case "Jan":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="01");break;
    case "Feb":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="02");break;
    case "Mar":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="03");break;
    case "Apr":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="04");break;
    case "May":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="05");break;
    case "Jun":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="06");break;
    case "Jul":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="07");break;
    case "Aug":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="08");break;
    case "Sep":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="09");break;
    case "Oct":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="10");break;
    case "Nov":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="11");break;
    case "Dec":finalTransactions=finalTransactions.filter((transaction)=>transaction.date.substring(5,7)==="12");break;
  }

  const data = finalTransactions.map((transaction) => ({ date: transaction.date, amount: transaction.amount }));

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    // You can perform any other actions based on the selected option here
  };

 const handleSelectedMonth = (value)=>{
  setSelectedMonth(value);
 }

 console.log(width);

  const config = {
    data: data,
    width:width>520?Math.max(600,lineChartWidth):400,
    height:Math.max(350,lineChartWidth-180),
    xField: 'date',
    yField: 'amount',
    point: {
      size: 3,
      shape: 'diamond',
    }
  };

  const pieData = finalTransactions.reduce((acc, curr) => {
    if (!acc[curr.tag]) {
      acc[curr.tag] = { tag: curr.tag, amount: 0 }; 
    }

    acc[curr.tag].tag = curr.tag;
    acc[curr.tag].amount += curr.amount;

    return acc;
  }, {});

  const spendingConfig = {
    data: Object.values(pieData),
    width: width>520?Math.max(lineChartWidth-180,400):350,
    height:Math.max(lineChartWidth-180,400),
    angleField: "amount",
    colorField: "tag",
  };

  return (
    <div className="charts-wrapper">
      <div className="line-graph">
        <div className="chart-header">
          {selectedOption === "All" && <h2>Financial Statistics</h2>}
          {selectedOption === "Income" && <h2>Income Statistics</h2>}
          {selectedOption === "Expenses" && <h2>Expense Statistics</h2>}
          <Select value={selectedOption} onChange={handleSelectChange} className="select-input-2">
            <Select.Option value="All">All</Select.Option>
            <Select.Option value="Income">Income</Select.Option>
            <Select.Option value="Expenses">Expenses</Select.Option>
          </Select>
        </div>
       
        <Line  {...config} />
       
      </div>
      <div className="pie-chart">
        <div className="chart-header">
        {selectedOption === "All" && <h2>All Transactions</h2>}
        {selectedOption === "Income" && <h2>Income Transactions</h2>}
        {selectedOption === "Expenses" && <h2>Expense Transactions</h2>}
        <Select value={selectedMonth} onChange={handleSelectedMonth} className="select-input-2">
          <Select.Option value="All">All</Select.Option>
            <Select.Option value="Jan">Jan</Select.Option>
            <Select.Option value="Feb">Feb</Select.Option>
            <Select.Option value="Mar">Mar</Select.Option>
            <Select.Option value="Apr">Apr</Select.Option>
            <Select.Option value="May">May</Select.Option>
            <Select.Option value="Jun">Jun</Select.Option>
            <Select.Option value="Jul">Jul</Select.Option>
            <Select.Option value="Aug">Aug</Select.Option>
            <Select.Option value="Sep">Sep</Select.Option>
            <Select.Option value="Oct">Oct</Select.Option>
            <Select.Option value="Nov">Nov</Select.Option>
            <Select.Option value="Dec">Dec</Select.Option>
            
          </Select>

        </div>
       
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
};

export default Charts;
