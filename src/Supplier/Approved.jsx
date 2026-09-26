
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Config/Base-url";

function Approved() {
  const supplier = JSON.parse(localStorage.getItem("supplier"));
  const SuppId = supplier?.supp_id;

  const [approvedOrders, setApprovedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (SuppId) {
      getApprovedOrders();
    } else {
      setLoading(false);
    }
  }, [SuppId]);

  const getApprovedOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}supplier/getdatawhere/tbl_orders/assigned_supplier/${SuppId}`
      );

      const orders = Array.isArray(res.data.data)
        ? res.data.data
        : [];

      console.log("Logged Supplier ID:", SuppId);
      console.log("All Assigned Orders:", orders);

      // Only logged-in supplier + Stage 8
      const approved = orders.filter((item) => {
        return (
          String(item.assigned_supplier) === String(SuppId) &&
          Number(item.order_stage) === 8
        );
      });

      console.log("Approved Orders:", approved);

      setApprovedOrders(approved);
    } catch (error) {
      console.error("Approved Orders Error:", error);
      setApprovedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Logged-in Supplier Name
  const supplierName =
    supplier?.supp_company_name ||
    supplier?.supp_contact_person ||
    "-";

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div className="page-heading-copy">

          <span className="page-icon">
            <i
              className="bi bi-file-text"
              aria-hidden="true"
            ></i>
          </span>

          <div>
            <p className="eyebrow mb-1">
              All
            </p>

            <h1 className="h3 mb-1">
              Approved
            </h1>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <section className="panel">

        <div className="table-responsive">

          <table
            className="table align-middle mb-0"
            id="ordersTable"
          >

            <thead>
              <tr className="text-center">

                <th>
                  Supplier Name
                </th>

                <th>
                  Order Code
                </th>

                <th>
                  Quotation
                </th>

                <th>
                  Remark
                </th>

                <th>
                  Request Date & Time
                </th>

              </tr>
            </thead>

            <tbody className="activity-date-time">

              {/* LOADING */}
              {loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {/* NO DATA */}
              {!loading && approvedOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4"
                  >
                    No approved orders found.
                  </td>
                </tr>
              )}

              {/* ORDERS */}
              {!loading &&
                approvedOrders.length > 0 &&
                approvedOrders.map((item, index) => (

                  <tr
                    key={item.order_id || index}
                    className="text-center"
                  >

                    {/* SUPPLIER NAME */}
                    <td className="fw-bold">
                      {supplierName}
                    </td>

                    {/* ORDER CODE */}
                    <td className="fw-bold">
                      {item.order_code || "N/A"}
                    </td>

                    {/* QUOTATION */}
                    <td>
                      {item.order_quotation ? (
                        <a
                          href={`${BASE_URL}public/Uploads/${item.order_quotation}`}
                          className="text-danger fw-bold text-decoration-none"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Quotations
                        </a>
                      ) : (
                        <span>
                          No Quotation
                        </span>
                      )}
                    </td>

                    {/* REMARK */}
                    <td>
                      {item.order_remark || "N/A"}
                    </td>

                    {/* DATE & TIME */}
                    <td>
                      {item.order_request_date || "N/A"}{" "}
                      {item.order_request_time || ""}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Approved;
