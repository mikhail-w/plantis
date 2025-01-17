import React, { useState, useEffect } from 'react';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import '../assets/styles/PlaceOrder.css';

function PlaceOrderPage() {
  const orderCreate = useSelector(state => state.orderCreate);
  const { order, error, success } = orderCreate;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector(state => state.cart);
  // SHIPPING FREE IF ITEMS OVER $100
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
  cart.taxPrice = Number(0.082 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, navigate]);

  const placeOrder = () => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    } else {
      dispatch(
        createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        })
      );
    }
  };

  return (
    <Container fluid="sm" className="orderContainer">
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="mt-5">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item id="payment">
              <h2>Shipping</h2>

              <p>
                <strong>Shipping: </strong>
                <span>{cart.shippingAddress.address}</span>,{' '}
                <span>{cart.shippingAddress.city}</span>
                {'  '}
                <span>{cart.shippingAddress.postalCode}</span>,{'  '}
                <span>{cart.shippingAddress.country}</span>
              </p>
            </ListGroup.Item>

            <ListGroup.Item id="payment">
              <h2>Payment Method</h2>
              <p id={'p'}>
                <strong>Method: </strong>
                <span>{cart.paymentMethod}</span>
              </p>
            </ListGroup.Item>

            <ListGroup.Item id="payment">
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index} id="payment">
                      <Row>
                        <Col md={1}>
                          <Image
                            src={`http://127.0.0.1:8000${item.image}`}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            <span>{item.name}</span>
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item className="text-center">
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PlaceOrderPage;
