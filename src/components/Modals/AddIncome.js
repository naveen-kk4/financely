import {React,useEffect} from "react";
import{Card,Col,Row,Button,Modal,Form,Input,DatePicker,Select} from "antd";
import moment from "moment";
import "./styles.css"

const AddIncomeModal = ({isIncomeModaleVisible,handleIncomeCancel,onFinish , updateIncome})=>{
   
     const [form] = Form.useForm();
    
     
     useEffect(() => {
      if (Object.keys(updateIncome).length > 0) {
        form.setFieldsValue({ ...updateIncome, date: moment(updateIncome.date, 'YYYY-MM-DD') });
      } else {
         console.log("hello");
        form.resetFields(); // Reset fields if updateIncome is empty
      }
    }, [updateIncome]);
     return(
      <Modal style={{fontWeight:"bold"}} className="modale-style" title={Object.entries(updateIncome).length==0?"Add Income" : "Update Income"} open={isIncomeModaleVisible} onCancel={handleIncomeCancel} footer={null}>
         <Form form={form} layout="vertical" onFinish={(values)=>{
            onFinish(values,"income");
            form.resetFields();
         }}
         >
         
            <Form.Item label="Name" name="name" rules={[{required: true, message:"Please input the income name!" }]}>
               <Input  type="text" className = "custom-input"></Input>
            </Form.Item>
            <Form.Item label="Amount" name="amount" rules={[{required: true, message:"Please input the income amount!" }]}>
               <Input type="number" className = "custom-input"></Input>
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{required: true, message:"Please select the date!" }]}>
               <DatePicker  className="custom-input" format="YYYY-MM-DD"></DatePicker>
            </Form.Item>
            <Form.Item label="Tag" name="tag" rules={[{required: true, message:"Please select a tag!" }]}>
               <Select className="select-input-2">
                  <Select.Option value="Salary">Salary</Select.Option>
                  <Select.Option value="Freelance">Freelance</Select.Option>
                  <Select.Option value="Investment">Investment</Select.Option>
                  
               </Select>
            </Form.Item>
            <Form.Item label="Description" name="description">
            <Input type="text" className = "custom-input"></Input>
            </Form.Item>
            <Form.Item >
               <Button className="btn btn-blue" type="primary" htmlType="submit">{Object.entries(updateIncome).length==0?"Add Income" : "Update Income"}</Button>
            </Form.Item>
         </Form>
      </Modal>
     )
}


export default AddIncomeModal;