import {React,useEffect} from "react";
import moment from "moment";
import{Card,Col,Row,Button,Modal,Form,Input,DatePicker,Select} from "antd";
import "./styles.css"

const AddExpenseModal = ({isExpenseModaleVisible,handleExpenseCancel,onFinish,updateExpense})=>{
     const [form] = Form.useForm();
     useEffect(() => {
      if (Object.keys(updateExpense).length > 0) {
        form.setFieldsValue({ ...updateExpense, date: moment(updateExpense.date, 'YYYY-MM-DD') });
      } else {
        form.resetFields(); // Reset fields if updateExpense is empty
      }
    }, [updateExpense, form]);
     return(
      <Modal className="modale-style" title={Object.keys(updateExpense).length > 0?"Update expense":"Add Expense"} open={isExpenseModaleVisible} onCancel={handleExpenseCancel} footer={null}>
         <Form form={form} layout="vertical" onFinish={(values)=>{
            onFinish(values,"expenses");
             form.resetFields();
            
         }}
          >
            <Form.Item label="Name" name="name" rules={[{required: true, message:"Please input the name of the transaction!" }]}>
               <Input   type="text" className = "custom-input"></Input>
            </Form.Item>
            <Form.Item label="Amount" name="amount" rules={[{required: true, message:"Please input the expense amount!" }]}>
               <Input type="number" className = "custom-input"></Input>
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{required: true, message:"Please select the date!" }]}>
               <DatePicker className="custon-input" format="YYYY-MM-DD"></DatePicker>
            </Form.Item>
            <Form.Item label="Tag" name="tag" rules={[{required: true, message:"Please select a tag!" }]}>
               <Select className="select-input-2">
                  <Select.Option value="Food & Beverage">Food & Beverage</Select.Option>
                  <Select.Option value="Education">Education</Select.Option>
                  <Select.Option value="Housing">Housing</Select.Option>
                  <Select.Option value="Transportation">Transportation</Select.Option>
                  <Select.Option value="Miscellaneous">Miscellaneous</Select.Option>
               </Select>
            </Form.Item>
            <Form.Item label="Description" name="description">
            <Input type="text" className = "custom-input"></Input>
            </Form.Item>
            <Form.Item >
               <Button className="btn btn-blue" type="primary" htmlType="submit">{Object.keys(updateExpense).length > 0?"Update expense":"Add Expense"}</Button>
            </Form.Item>
         </Form>
      </Modal>
     )
}


export default AddExpenseModal;