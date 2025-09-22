import React, {useState, useEffect, useRef} from 'react'
import { NavLink } from 'react-router-dom'
import {Form, Breadcrumb, Flex} from 'antd'
import AddSalesOrderForm from '../../components/export/sales_order/AddSalesOrderForm'
import { useAuthContext } from '../../contexts/AuthContext'
import customerHTTP from '../../services/CustomerService'

const AddSalesOrder = () => {
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [customers, setCustomers] = useState([]);
    const [addSalesOrderForm] = Form.useForm();

    useEffect(() => {
      const fetchCustomers = async() => {
        try {
          const response = await customerHTTP.get('/allLight', {
            headers: {
              Authorization: `Bearer ${persistToken.current}`
            }
          })
          if (response.status === 200) {
            setCustomers(response.data);
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      fetchCustomers();
    }, []);
    return (
      <React.Fragment>
          <div>
            <Breadcrumb 
              items={
                [ {
                    title:  (<NavLink to="/export">
                              <span>Nhập kho</span>
                            </NavLink>)
                  },
                  {
                    title: "Tạo phiếu xuất"
                  }
                ]
              }
            />
          </div>
          <Flex 
            justify='center' 
            align='center' 
            style={{
              width: '100%',
              marginTop: '0.8rem'
            }}
          >
            <AddSalesOrderForm
              addSalesOrderForm={addSalesOrderForm}
              customers={customers}
            />
          </Flex>
      </React.Fragment>
    )
}

export default AddSalesOrder