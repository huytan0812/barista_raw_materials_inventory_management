import React, {useState, useEffect} from 'react'
import {Table, Button, Flex} from 'antd'
import {useNavigate} from 'react-router-dom'
import axiosHTTP from '../../services/CategoryService'

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axiosHTTP.get('/list',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        setCategories(response.data.content);
        }
        catch(error) {
          console.log(error);
          navigate('/login')
        }
  
      }
      fetchCategories();
    }, [token, navigate]);
    
    return (
      <Table
        // loop through categories array by map() method
        // each item in dataSource array is an object
        // so that we copy all propeties of each category record, and add a unique key with category.id
        dataSource={categories.map(category => ({...category, key: category.id}))}
        columns={
          [
            {
              'title': 'ID',
              'dataIndex': 'id',
              'key': 'id'
            },
            {
              'title': 'Tên danh mục',
              'dataIndex': 'name',
              'key': 'name'
            },
            {
              'title': 'Mô tả',
              'dataIndex': 'description',
              'key': 'description'
            },
            {
              'title': "Danh mục cha",
              'dataIndex': 'parentName',
              'key': 'parentName'
            },
            {
              'title': "Hành động",
              'key': 'action',
              'render': () => {
                return (
                  <Flex gap="1rem">
                    <Button color="primary" variant="solid">
                      <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <Button color="red" variant="solid">
                      <span style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
                  </Flex>
                )
              }
            }
          ]
        }
      />
    )
}

export default CategoryTable