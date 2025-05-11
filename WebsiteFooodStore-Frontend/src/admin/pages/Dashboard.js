import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Table } from 'react-bootstrap';

function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });

    useEffect(() => {
        // In a real application, you would fetch this data from your API
        // For now, we'll use mock data
        const fetchDashboardData = async () => {
            try {
                // Mock data for demonstration
                setStats({
                    totalProducts: 42,
                    totalOrders: 156,
                    totalRevenue: 12500,
                    recentOrders: [
                        { id: 1, customer: 'John Doe', date: '2023-05-15', amount: 125.99, status: 'Completed' },
                        { id: 2, customer: 'Jane Smith', date: '2023-05-14', amount: 75.50, status: 'Processing' },
                        { id: 3, customer: 'Bob Johnson', date: '2023-05-13', amount: 200.00, status: 'Completed' },
                        { id: 4, customer: 'Alice Brown', date: '2023-05-12', amount: 50.25, status: 'Shipped' },
                        { id: 5, customer: 'Charlie Wilson', date: '2023-05-11', amount: 150.75, status: 'Completed' }
                    ]
                });
                
                // In a real application, you would use:
                // const response = await axios.get('/api/admin/dashboard');
                // setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <h2 className="mb-4">Dashboard</h2>
            
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-white bg-primary">
                        <Card.Body>
                            <Card.Title>Total Products</Card.Title>
                            <Card.Text className="h2">{stats.totalProducts}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-white bg-success">
                        <Card.Body>
                            <Card.Title>Total Orders</Card.Title>
                            <Card.Text className="h2">{stats.totalOrders}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-white bg-info">
                        <Card.Body>
                            <Card.Title>Total Revenue</Card.Title>
                            <Card.Text className="h2">${stats.totalRevenue.toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Card>
                <Card.Header>
                    <h5 className="mb-0">Recent Orders</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>${order.amount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge bg-${order.status === 'Completed' ? 'success' : order.status === 'Processing' ? 'warning' : 'info'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Dashboard; 