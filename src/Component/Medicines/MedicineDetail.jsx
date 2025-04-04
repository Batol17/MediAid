import { useParams } from "react-router";
import { useAddToCartMutation, useGetByIdQuery } from "../../redux/feature/api/categories/categoriesApi";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import img from '../../assets/3.jpg';

export default function MedicineDetail() {
  const { productId } = useParams();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { data, error, isLoading } = useGetByIdQuery(`products/${productId}`);

  const product = data?.product;

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">Failed to fetch product data!</p>;

  const handleCart = async () => {
    try {
      await addToCart(productId).unwrap();
      console.log('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Container>
      <Row style={{ height: '85vh' }} className="d-flex justify-content-center align-items-center py-5">
        {/* Product Details */}
        <Col lg={7}>
          <Card.Body>
            <h1 className="card-title text-center text-danger">{product?.name || "Not Available"}</h1>

            <div className="fw-bold pt-4 fs-4">
              <span className="ps-3">Brand:</span>
              <span className="text-secondary ps-2">{product?.brand || "Not Available"}</span>
            </div>

            <div className="fw-bold fs-4">
              <span className="ps-3">Category:</span>
              <span className="text-secondary ps-2">{product?.category || "Not Available"}</span>
            </div>

            <div className="fw-bold fs-4">
              <span className="ps-3">Sub Category:</span>
              <span className="text-secondary ps-2">{product?.sub_category || "Not Available"}</span>
            </div>

            <div className="fw-bold fs-4">
              <span className="ps-3">Quantity:</span>
              <span className="text-secondary ps-2">{product?.quantity || "Not Available"}</span>
            </div>

            <div className="fw-bold fs-4">
              <span className="ps-3">Price:</span>
              <span className="text-secondary ps-2">
                {product?.price ? (
                  <>
                    <span className="text-decoration-line-through">{product?.price}</span>
                    <span className="text-success"> L.C</span>
                  </>
                ) : "Not Available"}
              </span>
            </div>
          </Card.Body>

          {/* Product Description */}
          <div className="fs-6 overflow-auto" style={{ maxHeight: "200px" }}>
            <p className="ps-3">{product?.description || "No description available for this product."}</p>
          </div>

          <button 
            className="btn-cart mt-4 w-50 d-block mx-auto" 
            onClick={handleCart} 
            disabled={isAdding}
            variant="primary"
          >
            {isAdding ? "Adding to cart..." : "Add To Cart"}
          </button>
        </Col>

        {/* Product Image */}
        <Col lg={5} md={8} className="d-flex justify-content-center align-items-center">
          <Image
            src={img}
            className="rounded"
            alt="product"
            style={{ maxHeight: "62vh", width: "100%", objectFit: "cover" }}
          />
        </Col>
      </Row>
    </Container>
  );
}
