import React, {useState, useEffect, useRef} from 'react'
import {Pie} from '@ant-design/charts';
import {useAuthContext} from '../../contexts/AuthContext'
import productInvHTTP from '../../services/ProductInventory'

const InventoryChart = ({chartHeight}) => {
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [inventoryData, setInventoryData] = useState([]);
    const [totalInventory, setTotalInventory] = useState(1);
    
    useEffect(() => {
        const fetchInventoryData = async() => {
            try {
                const response = await productInvHTTP.get('getCurrentInventory', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        limit: 5
                    }
                });
                if (response.status === 200) {
                    let calcTotalInventory = 0;
                    for (let i = 0; i < response.data.topInventories.length; i++) {
                        calcTotalInventory += response.data.topInventories[i].currentInventory;
                    }
                    const totalRemainInventories = {
                        'productName': "Khác",
                        'currentInventory': response.data.totalRemainInventories
                    };
                    calcTotalInventory += response.data.totalRemainInventories;
                    setInventoryData([...response.data.topInventories, totalRemainInventories]);
                    setTotalInventory(calcTotalInventory);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchInventoryData();
    }, []);

    const inventoryConfig = {
        appendPadding: 10,
        data: inventoryData,
        angleField: 'currentInventory',
        colorField: 'productName',
        radius: 1,
        autoFit: true,
        height: chartHeight,
        label: {
            text: (record) => {
                return `${Math.round(record?.currentInventory/totalInventory*10000)/100}%`
            },
            style: { fontSize: '1.2rem', textAlign: 'center' },
        },
    };

    return (
        <Pie {...inventoryConfig} />
    )
}

export default InventoryChart