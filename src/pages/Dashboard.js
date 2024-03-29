import React, { useState , useEffect } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddIncomeModal from "../components/Modals/AddIncome";
import AddExpenseModal from "../components/Modals/AddExpense";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { addDoc,collection, query , getDocs, deleteDoc, doc,updateDoc } from "firebase/firestore";
import TransactionsTable from "../components/TransactionsTable";
import NoTransactions from "../components/NoTransactions";
import Charts from "../components/Charts";


const Dashboard =()=>{
    const[isIncomeModaleVisible,setIsIncomeModaleVisible] = useState(false);
    const[isExpenseModaleVisible,setIsExpenseModaleVisible] = useState(false);
    const [transactions,setTransactions] = useState([]);
    const[income,setIncome] = useState(0);
    const[expense,setExpense] = useState(0);
    const[balance,setBalance] = useState(0);
    const[loading,setLoading] = useState(false);
    const[user] = useAuthState(auth);
    const[updateIncome,setUpdateIncome] = useState({});
    const [updateExpense,setUpdateExpense] = useState({});



   useEffect(()=>{
    fetchTransactions();
   },[user])

   useEffect(()=>{
    calculateBalance()
   },[transactions]);


   function calculateBalance(){
    // console.log("tttt");
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction)=>{
        if(transaction.type==="income")incomeTotal+=transaction.amount;
        else expenseTotal+=transaction.amount;
    });
    
    setBalance(incomeTotal-expenseTotal);
    setExpense(expenseTotal);
    setIncome(incomeTotal);

   }

   async function fetchTransactions(noToast=false){
    
    setLoading(true);
    if(user){
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionArray = [];
    querySnapshot.forEach((doc)=>{
        console.log(doc);
       
        transactionArray.push({...doc.data(),"key":doc.id});
    });
    setTransactions(transactionArray);
    
    if(!noToast)toast.success("Transactions Fetched!");
    }
    setLoading(false);
   }
     function showExpenseModale(){
    setIsExpenseModaleVisible(true);
     }
     function showIncomeModale(){
        setIsIncomeModaleVisible(true);

     }

     function handleIncomeCancel(){
        setUpdateIncome({});
      
        setIsIncomeModaleVisible(false);
       

     }
     function handleExpenseCancel(){
        setUpdateExpense({});
        
       setIsExpenseModaleVisible(false);
       
     }

     function onFinish(values,type){
        const description = values.description || " ";
        console.log(updateIncome);
        const newTransaction = {
            type:type,
            date:values.date.format("YYYY-MM-DD"),
            amount:parseFloat(values.amount),
            tag:values.tag,
            name:values.name,
            description:description
        }
        console.log(type);

        if(type==="expenses" && Object.keys(updateExpense).length>0){
            newTransaction["key"]=updateExpense.key;
            updateTransaction(newTransaction);
        }
        else if(type==="income" && Object.keys(updateIncome).length>0){
            newTransaction["key"]=updateIncome.key;
            updateTransaction(newTransaction);
        }
        
        else addTransaction(newTransaction,false);
        
     }


     async function deleteTransaction(record){
        try{
        await deleteDoc(doc(db, `users/${user.uid}/transactions`, record.key));
        console.log("record deleted successfully")
        toast.success("Transaction deleted");
        const newTransactions = transactions.filter((curr)=>{
            return curr.key!==record.key
           });
           setTransactions(newTransactions);
        
        
        }
        catch(e){
            toast.error(e.message());
        }
    

     }

     async function updateTransaction(transaction){
       


try {
    const docRef = doc(db, `users/${user.uid}/transactions`, transaction.key);
  await updateDoc(docRef,transaction);
  console.log('Document successfully updated!');
  const newTransactions = transactions.map((curr)=>{
   return curr.key===transaction.key?transaction:curr;
  });
  setTransactions(newTransactions);
  
  
} catch (error) {
  console.error('Error updating document: ', error.message());
}
finally{
    Object.keys(updateIncome).length>0?setUpdateIncome(transaction):setUpdateExpense(transaction);
}

     }

   
      function updateData(record){
        
        if(record.type==="expenses"){
            setUpdateExpense(record);
            setIsExpenseModaleVisible(true);
        }
        else {
            
            setUpdateIncome(record);
            setIsIncomeModaleVisible(true);
        }

     }

    

     async function clearAll() {
        const response = prompt("This will delete all data!!! If you are sure type delete");
        if (response !== "delete") return;
    
        try {
            // Get a reference to the transactions collection
            const transactionsRef = collection(db, `users/${user.uid}/transactions`);
    
            // Retrieve all documents in the collection
            const querySnapshot = await getDocs(transactionsRef);
    
            // Check if there are any documents to delete
            if (querySnapshot.empty) {
                console.log("No documents found in the collection.");
                return;
            }
    
            // Delete each document
    for (let index = 0; index < querySnapshot.docs.length; index++) {
        const docSnapshot = querySnapshot.docs[index];
        try {
            await deleteDoc(doc(db, `users/${user.uid}/transactions`, docSnapshot.id));
            
            // Check if it's the last document
            if (index === querySnapshot.docs.length - 1) {
                await fetchTransactions(true);
                
            }
        } catch (error) {
            console.error(`Error deleting document with ID ${docSnapshot.id}:`, error.message());
        }
    }

    // Notify the user that all documents have been deleted successfully
    console.log("All documents have been deleted successfully!");
} catch (error) {
    console.error("Error deleting documents:", error);
    // Notify the user about the error
    toast.error("An error occurred while deleting documents. Please try again later.");
}
   
}

     async function addTransaction(transaction , many){
        console.log(transaction);
           try{
               const docRef = await addDoc(
                collection(db,`users/${user.uid}/transactions`),
                transaction
               );
              if(!many) toast.success("Transaction Added!");
               console.log("Document written with ID: " , docRef.id);
               let newTransaction = transactions;
               transaction["key"]=docRef.id;
               newTransaction.push(transaction);
               setTransactions(newTransaction);
               console.log(transaction);
           }
           catch(e){
        console.error("Error adding document: ",e);
        
            if(!many)toast.error(e.message);
        
           }
     }
   const sortedTransactions = transactions.sort((a,b)=>{return new Date(a.date) - new Date(b.date)});

    
    return (
        <div>
            <Header></Header>
            {
                loading && <p>Loading...</p>
            }
            {!loading && <><Cards showExpenseModale={showExpenseModale} showIncomeModale={showIncomeModale} clearAll={clearAll} income={income} expense={expense} balance={balance} ></Cards>
            {transactions.length==0?<NoTransactions></NoTransactions>:<Charts sortedTransactions={sortedTransactions}></Charts>}
            <AddIncomeModal updateIncome={updateIncome} isIncomeModaleVisible={isIncomeModaleVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}></AddIncomeModal>
            <AddExpenseModal updateExpense={updateExpense} isExpenseModaleVisible={isExpenseModaleVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish}></AddExpenseModal></>}
            <TransactionsTable fetchTransactions={fetchTransactions} transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} updateTransaction={updateData}></TransactionsTable>
        </div>
    )
}
export default Dashboard;