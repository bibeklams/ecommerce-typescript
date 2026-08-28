// import { useEffect, useState } from "react";

// import toast from "react-hot-toast";

// import { useAppDispatch, useAppSelector } from "../../redux/hooks";

// import { createSeoThunk, updateSeoThunk } from "../../redux/slices/seoSlice";

// import { getAllProductsThunk } from "../../redux/slices/productSlice";

// import type { Seo } from "../../types/seo";

// import SeoForm from "../../components/admin/seo/SeoForm";
// import SeoTable from "../../components/admin/seo/SeoTable";

// const AdminSeo = () => {
//   const dispatch = useAppDispatch();

//   const { seoList, loading, error } = useAppSelector((state) => state.seo);

//   const { products } = useAppSelector((state) => state.product);

//   const [showForm, setShowForm] = useState(false);

//   const [editingSeo, setEditingSeo] = useState<Seo | null>(null);

//   // Get SEO and products
//   useEffect(() => {
//     dispatch(getAllSeoThunk());
//     dispatch(getAllProductsThunk());
//   }, [dispatch]);

//   // Add
//   const handleAdd = () => {
//     setEditingSeo(null);
//     setShowForm(true);
//   };

//   // Edit
//   const handleEdit = (seo: Seo) => {
//     setEditingSeo(seo);
//     setShowForm(true);
//   };

//   // Cancel
//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingSeo(null);
//   };

//   // Create / Update
//   const handleSubmit = async (data: {
//     title: string;
//     description?: string;
//     canonicalUrl?: string;
//     productId: number;
//   }) => {
//     // UPDATE
//     if (editingSeo) {
//       const result = await dispatch(
//         updateSeoThunk({
//           id: editingSeo.id,
//           data,
//         }),
//       );

//       if (updateSeoThunk.fulfilled.match(result)) {
//         toast.success("SEO updated successfully");

//         setShowForm(false);
//         setEditingSeo(null);
//       } else {
//         toast.error(result.error.message ?? "Failed to update SEO");
//       }

//       return;
//     }

//     // CREATE
//     const result = await dispatch(createSeoThunk(data));

//     if (createSeoThunk.fulfilled.match(result)) {
//       toast.success("SEO created successfully");

//       setShowForm(false);
//     } else {
//       toast.error(result.error.message ?? "Failed to create SEO");
//     }
//   };

//   // Delete
//   const handleDelete = async (id: number) => {
//     const result = await dispatch(deleteSeoThunk(id));

//     if (deleteSeoThunk.fulfilled.match(result)) {
//       toast.success("SEO deleted successfully");
//     } else {
//       toast.error(result.error.message ?? "Failed to delete SEO");
//     }
//   };

//   return (
//     <main>
//       <h1>SEO Management</h1>

//       {/* Add SEO */}
//       {!showForm && (
//         <button type="button" onClick={handleAdd}>
//           Add SEO
//         </button>
//       )}

//       {/* Form */}
//       {showForm && (
//         <SeoForm
//           products={products}
//           editingSeo={editingSeo}
//           loading={loading}
//           onSubmit={handleSubmit}
//           onCancel={handleCancel}
//         />
//       )}

//       {/* Error */}
//       {error && <p>{error}</p>}

//       {/* Table */}
//       <SeoTable
//         seoList={seoList}
//         products={products}
//         loading={loading}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
//     </main>
//   );
// };

// export default AdminSeo;
