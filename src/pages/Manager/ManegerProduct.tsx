import React, { useState } from "react";
import HeaderStaff from "../../layouts/HeaderStaff";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SidebarStaff from "../../layouts/SidebarStaff";
import {
  getListBrandI,
  getListCategory,
  getListSportId,
} from "../../api/Product/importProduct";

import { createProduct } from "../../api/Blog/apiBlog";
import Swal from "sweetalert2";

const ManegerProduct = () => {
  const [CategoryId, SetCategoryId] = useState("");
  const [BrandId, SetBrandId] = useState("");
  const [SportId, SetSportId] = useState("");
  const [ProductCode, SetProductCode] = useState("");
  const [MainImage, setMainImage] = useState<File | null>(null);
  const [ProductImages, setProductImages] = useState<FileList | null>(null);
  const [Quantity, SetQuantity] = useState("");
  const [ProductName, SetProductName] = useState("");
  const [ListedPrice, SetListedPrice] = useState("");
  const [IsRent, SetIsRent] = useState(true);
  const [Price, SetPrice] = useState("");
  const [RentPrice, SetRentPrice] = useState("");
  const [Size, SetSize] = useState("");
  const [Description, SetDescription] = useState("");
  const [Color, SetColor] = useState("");
  const [Condition, SetCondition] = useState("");
  const [Offers, SetOffers] = useState("");
  const [Discount, SetDiscount] = useState("");
  const { data: categoryData } = useQuery({
    queryKey: ["dataCategory"],
    queryFn: getListCategory,
  });
  const { data: brandData } = useQuery({
    queryKey: ["dataBrand"],
    queryFn: getListBrandI,
  });
  const category = categoryData?.data?.data?.$values;
  const brand = brandData?.data?.data?.$values;

  const { data: sportData } = useQuery({
    queryKey: ["dataSport"],
    queryFn: getListSportId,
  });
  const sport = sportData?.data?.data?.$values;

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    SetCategoryId(selectedId);
    console.log("Selected Category ID:", selectedId);
  };
  const handleSelectBrandChange = (event) => {
    const selectedId = event.target.value;
    SetBrandId(selectedId);
    console.log("Selected Brand ID:", selectedId);
  };
  const handleSelectSportChange = (event) => {
    const selectedId = event.target.value;
    SetSportId(selectedId);
    console.log("Selected Sport ID:", selectedId);
  };
  const queryClient = useQueryClient();
  //create product
  const { mutate: mutateCreateProduct } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("CategoryId", CategoryId);
      formData.append("BrandId", BrandId);
      formData.append("SportId", SportId);
      formData.append("ProductCode", ProductCode);

      if (MainImage) {
        formData.append("MainImage", MainImage);
      }
      if (ProductImages) {
        for (let i = 0; i < ProductImages.length; i++) {
          formData.append("ProductImages", ProductImages[i]);
        }
      }
      formData.append("Quantity", Quantity);
      formData.append("ProductName", ProductName);
      formData.append("ListedPrice", ListedPrice);
      formData.append("IsRent", IsRent.toString());
      formData.append("Price", Price);
      formData.append("RentPrice", RentPrice);
      formData.append("Size", Size);
      formData.append("Description", Description);
      formData.append("Color", Color);
      formData.append("Condition", Condition);
      formData.append("Offers", Offers);
      formData.append("Discount", Discount);
      await createProduct(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataBlogs"] });

      Swal.fire({
        title: "Success!",
        text: "Product created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      SetCategoryId("");
      SetBrandId("");
      SetSportId("");
      SetProductCode("");
      setMainImage(null);
      setProductImages(null);
      SetQuantity("");
      SetProductName("");
      SetListedPrice("");
      SetIsRent(true);
      SetPrice("");
      SetRentPrice("");
      SetSize("");
      SetDescription("");
      SetColor("");
      SetCondition("");
      SetOffers("");
      SetDiscount("");
    },
    onError: (error) => {
      console.error("Error creating blog:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error creating the blog.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (ProductName && Description) {
      mutateCreateProduct(); // Update blog if blogId is present
    } else {
      alert("Please fill in the title and content!");
    }
  };
  return (
    <div>
      <div>
        <HeaderStaff />
        <div className="flex h-full">
          <SidebarStaff />
          <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">Maneger Product</h1>
              <select
                onChange={handleSelectChange}
                className="mt-4 p-2 border rounded"
              >
                <option value="">Chọn danh mục</option>
                {category?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
              <select
                onChange={handleSelectBrandChange}
                className="mt-4 p-2 border rounded"
              >
                <option value="">Chọn thương hiệu</option>
                {brand?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.brandName}
                  </option>
                ))}
              </select>
              <select
                onChange={handleSelectSportChange}
                className="mt-4 p-2 border rounded"
              >
                <option value="">Chọn môn thể thao</option>
                {sport?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Product Code"
                value={ProductCode}
                onChange={(e) => SetProductCode(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="file"
                onChange={(e) => setMainImage(e.target.files?.[0] ?? null)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="file"
                multiple
                onChange={(e) => setProductImages(e.target.files)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={Quantity}
                onChange={(e) => SetQuantity(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Product Name"
                value={ProductName}
                onChange={(e) => SetProductName(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Listed Price"
                value={ListedPrice}
                onChange={(e) => SetListedPrice(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="checkbox"
                checked={IsRent}
                onChange={(e) => SetIsRent(e.target.checked)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={Price}
                onChange={(e) => SetPrice(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Rent Price"
                value={RentPrice}
                onChange={(e) => SetRentPrice(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Size"
                value={Size}
                onChange={(e) => SetSize(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={Description}
                onChange={(e) => SetDescription(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Color"
                value={Color}
                onChange={(e) => SetColor(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Condition"
                value={Condition}
                onChange={(e) => SetCondition(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Offers"
                value={Offers}
                onChange={(e) => SetOffers(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Discount"
                value={Discount}
                onChange={(e) => SetDiscount(e.target.value)}
                className="mt-4 p-2 border rounded"
              />
              <button
                onClick={handleSubmit}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManegerProduct;
