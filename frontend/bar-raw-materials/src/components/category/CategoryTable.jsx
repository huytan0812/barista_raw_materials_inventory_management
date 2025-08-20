import React, {useState, useEffect} from 'react'
import {Table} from 'antd'
import axiosHTTP from '../../services/CategoryService'

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
      const fetchCategories = async () => {
        const response = await axiosHTTP.get('/list',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        setCategories(response.data);
      }
      fetchCategories();
    }, [token]);

    console.log(categories);

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
              'title': 'Name',
              'dataIndex': 'name',
              'key': 'name'
            },
            {
              'title': 'Description',
              'dataIndex': 'description',
              'key': 'description'
            }
          ]
        }
      />
    )
}

export default CategoryTable