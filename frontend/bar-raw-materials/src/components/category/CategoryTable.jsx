import React, {useState, useEffect} from 'react'
import {Table, Button, Flex} from 'antd'
import {useNavigate} from 'react-router-dom'
import {useAuthContext} from '../../contexts/AuthContext'
import axiosHTTP from '../../services/CategoryService'

const CategoryTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata,
        refreshCtgs,
        setRefreshCtgs
    } = props;
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const {token} = useAuthContext();

    const columns= [
        {
          'title': 'STT',
          'key': 'index',
          render: (text, record, index) => index + 1,
          align: "center"
        },
        {
          'title': 'Tên danh mục',
          'dataIndex': 'name',
          'key': 'name',
          align: "center"
        },
        {
          'title': 'Mô tả',
          'dataIndex': 'description',
          'key': 'description',
          align: 'left',
          titleAlign: "center"
        },
        {
          'title': "Danh mục cha",
          'dataIndex': 'parentName',
          'key': 'parentName',
          align: 'left',
          titleAlign: "center"
        },
        {
          'title': "Hành động",
          'key': 'action',
          'render': () => {
            return (
              <Flex gap="1rem" justify='center'>
                <Button color="primary" variant="solid">
                  <span style={{fontSize: '1.4rem'}}>Sửa</span>
                </Button>
                <Button color="red" variant="solid">
                  <span style={{fontSize: '1.4rem'}}>Xóa</span>
                </Button>
              </Flex>
            )
          },
          align: "center"
        }
      ];

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axiosHTTP.get('/list',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              page: currentPage - 1,
              size: pageSize
            }
          });
          if (response.status === 200) {
            setCategories(response.data.content);
            const {content:_, ...rest} = response.data;
            setPageMetadata(rest);
          }
        }
        catch(error) {
          console.log(error);
          navigate('/login');
        }
  
      }
      fetchCategories();
    }, [token, navigate, currentPage, pageSize, refreshCtgs]);
    
    return (
      <Table
        columns={columns}
        dataSource={categories.map(category => ({...category, key: category.id}))}
        pagination={false}
      />
    )
}

export default CategoryTable