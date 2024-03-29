import React, { useState , useRef } from "react";
import "./styles.css"
import { Radio, Select, Table, Input,Space,Button, Tag } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import upImg from "../../assets/caret-up.png"
import upSvg from "../../assets/caret-up-black.png"
import downImg from "../../assets/caret-down.png"
import downSvg from "../../assets/caret-down-black.png"
const TransactionsTable = ({transactions , addTransaction , deleteTransaction , updateTransaction})=>{
  const[sortOrder,setSortOrder] = useState("dsc");
    const[selectedMonth,setSelectedMonth] = useState("Months");
    const[typeFilter, setTypeFilter] = useState("");
    const[sortKey,setSortKey]= useState("");
    const{Option} = Select;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleSelectedMonth = (value)=>{
      setSelectedMonth(value);
    }
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });

 
    

    const columns=[
        {
            title:"Name",
            dataIndex:"name",
            key:"name",
            ...getColumnSearchProps('name')
        },
        {
            title:"Amount",
            dataIndex:"amount",
            key:"amount"
        },
        {
            title:"Tag",
            dataIndex:"tag",
            key:"tag"
        },
        {
            title:"Type",
            dataIndex:"type",
            key:"type"
        },
        {
            title:"Date",
            dataIndex:"date",
            key:"date"
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_, record) => (
            <Space className="action-tag">
              <Tag onClick={()=>{updateTransaction(record)}}  color="geekblue" key="geekblue">Update</Tag>
              <Tag onClick={()=>{deleteTransaction(record)}} color="volcano" key="volcano">Delete</Tag>
            </Space>
          ),
        },
       
    ];
   
    
   
   
let filteredTransactions = transactions.filter((transaction)=>{
  
   return  transaction.type.includes(typeFilter);
});

switch(selectedMonth){

  case "Jan":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="01");break;
  case "Feb":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="02");break;
  case "Mar":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="03");break;
  case "Apr":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="04");break;
  case "May":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="05");break;
  case "Jun":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="06");break;
  case "Jul":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="07");break;
  case "Aug":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="08");break;
  case "Sep":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="09");break;
  case "Oct":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="10");break;
  case "Nov":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="11");break;
  case "Dec":filteredTransactions=filteredTransactions.filter((transaction)=>transaction.date.substring(5,7)==="12");break;
}

let sortedTransactions = filteredTransactions.sort((a,b)=>{
  if(sortOrder==="asc"){
     if(sortKey==="date")return new Date(a.date) - new Date(b.date);
     else if(sortKey==="amount")return a.amount - b.amount;
     else return 0;
  }
  else{
    if(sortKey==="date")return new Date(b.date) - new Date(a.date);
    else if(sortKey==="amount")return b.amount - a.amount;
    else return 0;
  }
 })  ;





 function exportCSV(){
    var csv = unparse({
  fields:["name","amount","tag","type","date"],
  data:transactions
    });
    const blob = new Blob([csv], {text:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href=url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

 }
 

 function importFromCSV(event){
    event.preventDefault();
    try{
   parse(event.target.files[0],{
    header:true,
    skipEmptyLines: true,
    complete:async function (results) {

      for(const transaction of results.data){
            await addTransaction({...transaction,amount:parseFloat(transaction.amount)},true);
        }
        
    }

   });
   toast.success("All Transactions Added");  
   event.target.files=null;
    }
    catch(e){
     toast.error(e.message);
    }

 }
 
return (
        <div style={{width:"95%" , minWidth:"670px"}}>
           
            <div className="my-table">
                <div>
                    <h2>My Transactions</h2>
                    
            <div className="exp-imp-wrapper">
                <button className="btn" onClick={exportCSV}>Export to CSV</button>
                <label htmlFor="file-csv" className="btn btn-blue">
                    Import from CSV
                </label>
                <input onChange={importFromCSV} id="file-csv" type="file" accept=".csv" required style={{display:"none"}}/>

            </div>
           
                </div>
                <div className="search-select-wrapper">
        
        <Select className="select-input" placeholder="Filter" value={typeFilter} onChange={(value)=>setTypeFilter(value)} allowClear>
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
        </Select>
        <div className="filter-options">
        <Radio.Group className="input-radio" value={sortKey} onChange={(e)=>setSortKey(e.target.value)}>
             <Radio.Button value="All">All</Radio.Button>
             <Radio.Button value="date">Sort By Date</Radio.Button>
             <Radio.Button value="amount">Sort By Amount</Radio.Button>
            </Radio.Group>
        <div>
             {/* <Radio.Button value={sortOrder==="asc"?"dsc":"asc"}>{sortOrder==="asc"?"high-low":"low-high"}</Radio.Button> */}
             <img onClick={()=>{setSortOrder("asc")}}  src={sortOrder==="asc"?upImg:upSvg}></img>
             <img onClick={()=>{setSortOrder("dsc")}} src={sortOrder==="dsc"?downImg:downSvg}></img>
            </div>
            </div>
            <Select className="select-input" value={selectedMonth} onChange={handleSelectedMonth}>
          <Select.Option  value="All">All</Select.Option>
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
           
            
        </div>
        <Table style={{width:"95vw"}} dataSource={sortedTransactions} columns={columns} expandable={{
      expandedRowRender: (record) => (
        <p
          style={{
            margin: 0,
          }}
        >
          {record.description}
        </p>
      ),
      rowExpandable: (record) => record.description !==" ",
    }}></Table>
        </div>
        
    )
}
export default TransactionsTable;