/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchParishesList } from "@/store/slices/church";
import StoreProvider from "@/store/provider";
import CreateChurchModal from "../Modal/CreateChurchModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../Button";
import {
  CreateChurchFormType,
  createChurchSchema,
  defaultValues,
} from "./Schema";
import { createParish } from "@/lib/actions/church";

const ChurchComp = () => {
  const dispatch = useAppDispatch();
  const { parishesList } = useAppSelector((state) => state.church);

  const [isLoadingParishList, setIsLoadingParishList] = useState(true);
  const [isAddChurchModalOpen, setIsAddChurchModalOpen] = useState(false);
  const [isCreatingChurch, setIsCreatingChurch] = useState(false);

  const hookForm = useForm<CreateChurchFormType>({
    resolver: zodResolver(createChurchSchema),
    defaultValues: defaultValues,
  });

  const handleAddChurch = async (data: CreateChurchFormType) => {
    setIsCreatingChurch(true);
    console.log("Submitting church data:", data);

    const transformedData = {
      ...data,
      timezone: data.timezone?.value || "UTC",
      subscription_plan: data.subscription_plan?.value || "",
    };

    const res = await createParish(transformedData);
    console.log("Church creation response:", res);
    setIsCreatingChurch(false);
    setIsAddChurchModalOpen(false);
    hookForm.reset();
    dispatch(fetchParishesList());
  };

  const stats = [
    {
      label: "Total Parishes",
      value: parishesList?.length || 0,
      color: "text-gray-800",
    },
    {
      label: "Active",
      value: parishesList?.filter((p) => p.is_active)?.length || 0,
      color: "text-blue-600",
    },
    {
      label: "Pending Approval",
      value: parishesList?.filter((p) => !p.is_active)?.length || 0,
      color: "text-yellow-600",
    },
    {
      label: "Total Subscribers",
      value: parishesList?.length || 0,
      color: "text-gray-800",
    },
  ];

  useEffect(() => {
    const fetchParishList = async () => {
      setIsLoadingParishList(true);
      await dispatch(fetchParishesList());
      setIsLoadingParishList(false);
    };

    fetchParishList();
  }, [dispatch]);

  return (
    <div className="church-management-container">
      {/* Header */}
      <div className="header">
        <div>
          <h1>Church Management</h1>
          <p>Manage parish registrations and approve new church requests</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsAddChurchModalOpen(true)}
        >
          Add Church
        </Button>
      </div>

      <CreateChurchModal
        isOpen={isAddChurchModalOpen}
        onClose={() => {
          setIsAddChurchModalOpen(false);
          hookForm.reset(); // Reset form when closing modal
        }}
        isCreating={isCreatingChurch}
        onSubmit={handleAddChurch}
      />

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <p>{stat.label}</p>
            <p className={`stat-value ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by parish name, diocese, or city..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {isLoadingParishList ? (
          <p className="text-center py-4">Loading parishes...</p>
        ) : parishesList && parishesList.length > 0 ? (
          <table className="church-table">
            <thead>
              <tr>
                <th>Parish Name</th>
                <th>Diocese</th>
                <th>City</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parishesList.map((parish: any) => (
                <tr key={parish.parish_id}>
                  <td>{parish.parish_name}</td>
                  <td>{parish.diocese}</td>
                  <td>{parish.city}</td>
                  <td>
                    <div className="contact-info">
                      <div>{parish.phone}</div>
                      <div className="contact-email">{parish.email}</div>
                    </div>
                  </td>
                  <td className="capitalize">{parish.subscription_plan}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        parish.is_active ? "status-active" : "status-pending"
                      }`}
                    >
                      {parish.is_active ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td>
                    {new Date(parish.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-button icon-button edit-button">
                        <Edit2 size={16} />
                      </button>
                      <button className="action-button icon-button delete-button">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4 text-gray-500">No parishes found.</p>
        )}
      </div>
    </div>
  );
};

const Church = () => {
  return (
    <StoreProvider>
      <ChurchComp />
    </StoreProvider>
  );
};

export default Church;
