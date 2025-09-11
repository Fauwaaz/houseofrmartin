import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/db/table=fxiEe_posts&post_type=product&post_status=publish")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.ID}>{p.post_title}</li>
        ))}
      </ul>
    </div>
  );
}
