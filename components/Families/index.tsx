/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Button from "@/components/Button";
import { Card } from "@/components/Card";
import Badge from "@/components/Badge";
import { promiseTracker } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/hooks";
import toaster from "@/lib/toastify";
import StoreProvider from "@/store/provider";
import { Plus, Search, Users, User, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateFamilyModal, {
  createFamilySchema,
  CreateFamilyFormType,
} from "@/components/Modal/CreateFamilyModal";
import { createFamily } from "@/lib/actions/familes";
import { fetchWardsList } from "@/store/slices/wards";
import {
  fetchFamiliesList,
  searchFamilies,
  clearSearchResults,
} from "@/store/slices/families";

const FamiliesPageComp = () => {
  const dispatch = useAppDispatch();
  const router = useRouter(); // Initialize useRouter
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState(false);
  const [isCreatingFamily, setIsCreatingFamily] = useState(false);

  const profile = useAppSelector((state) => state.profile.userProfile);
  const wardsState = useAppSelector((state) => state.wards);

  // Get data from Redux store
  const {
    familiesList,
    currentPage,
    totalPages,
    totalRecords,
    isLoading,
    isSearching,
    searchResults,
  } = useAppSelector((state) => state.families);

  const pageSize = 20;
  const parishId = profile?.parish?.parish_id || 1;

  useEffect(() => {
    if (wardsState.wardsList.length === 0 && parishId) {
      dispatch(fetchWardsList(Number(parishId)));
    }
  }, [dispatch]);

  const formattedWardsList = wardsState.wardsList.map((ward) => ({
    label: ward.ward_name,
    value: String(ward.ward_id),
  }));

  const createFamilyHookForm = useForm<CreateFamilyFormType>({
    resolver: zodResolver(createFamilySchema),
    defaultValues: {
      parish_id: Number(parishId),
      family_name: "",
      head_of_family: "",
      ward_id: { label: "", value: "" },
      member_count: "",
      home_phone: "",
      address: "",
    },
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch families from Redux
  useEffect(() => {
    if (!parishId || debouncedSearchQuery) return;
    if (familiesList.length === 0) {
      dispatch(fetchFamiliesList(Number(parishId), currentPage, pageSize));
    }
  }, [dispatch, parishId, currentPage, debouncedSearchQuery]);

  // Search families using Redux
  useEffect(() => {
    if (!parishId) return;

    if (debouncedSearchQuery) {
      dispatch(searchFamilies(Number(parishId), debouncedSearchQuery));
    } else {
      dispatch(clearSearchResults());
    }
  }, [dispatch, parishId, debouncedSearchQuery]);

  const displayFamilies = debouncedSearchQuery ? searchResults : familiesList;

  const filteredFamilies = displayFamilies.filter((family) => {
    const matchesWard =
      selectedWard === "all" || String(family.ward_id) === selectedWard;
    return matchesWard;
  });

  const wards = Array.from(
    new Set(displayFamilies.map((f) => String(f.ward_id)))
  ).sort();

  const handleNextPage = () => {
    if (currentPage < totalPages && parishId) {
      dispatch(fetchFamiliesList(Number(parishId), currentPage + 1, pageSize));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && parishId) {
      dispatch(fetchFamiliesList(Number(parishId), currentPage - 1, pageSize));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateFamilyClick = () => {
    createFamilyHookForm.reset({
      parish_id: Number(parishId),
      family_name: "",
      head_of_family: "",
      ward_id: { label: "", value: "" },
      member_count: "",
      home_phone: "",
      address: "",
    });
    setIsCreateFamilyModalOpen(true);
  };

  const onCreateFamilySubmit = async (data: CreateFamilyFormType) => {
    setIsCreatingFamily(true);
    try {
      const familyData = {
        ...data,
        ward_id: Number(data.ward_id.value),
        parish_id: Number(parishId),
      };
      console.log(familyData);
      await promiseTracker(createFamily(familyData));
      toaster.success("Family created successfully!");
      setIsCreateFamilyModalOpen(false);
      dispatch(fetchFamiliesList(Number(parishId), 1, pageSize));
    } catch (error) {
      toaster.error("Failed to create family. Please try again.");
      console.error("Error creating family:", error);
    } finally {
      setIsCreatingFamily(false);
    }
  };

  return (
    <div className="families-page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Families</h1>
          <p>
            Manage parish families grouped by wards (
            {debouncedSearchQuery
              ? `${filteredFamilies.length} search results`
              : `${totalRecords} total families`}
            )
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={handleCreateFamilyClick}
        >
          Add Family
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="families-controls-wrapper">
        <div className="families-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by family name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {isSearching && (
              <span className="search-loading">Searching...</span>
            )}
          </div>
          <select
            className="ward-filter-button"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
          >
            <option value="all">All Wards</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                Ward {ward}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !debouncedSearchQuery && (
        <div className="loading-state">
          <p>Loading families...</p>
        </div>
      )}

      {/* Families Grid */}
      {!isLoading && (
        <>
          <div className="families-grid">
            {filteredFamilies.map((family) => (
              <Card key={family.family_id} className="family-card">
                <div className="family-card-header">
                  <div className="family-avatar">
                    <Users size={32} />
                  </div>
                  <div className="family-info">
                    <h3 className="family-name">{family.family_name}</h3>
                    <p className="family-head">
                      <User size={14} className="icon-small" />
                      Head: {family.head_of_family || "N/A"}
                    </p>
                  </div>
                  {family.is_active && <Badge variant="success">Active</Badge>}
                </div>

                <div className="family-card-body">
                  <div className="family-detail">
                    <span className="detail-label">Members</span>
                    <span className="detail-value">
                      {family.member_count || 0} people
                    </span>
                  </div>

                  {family.home_phone && (
                    <div className="family-address">
                      <Phone size={14} />
                      <span>{family.home_phone}</span>
                    </div>
                  )}

                  <div className="family-ward">
                    <Badge variant="primary">Ward {family.ward_id}</Badge>
                  </div>

                  {family.registration_date && (
                    <div className="family-detail">
                      <span className="detail-label">Registered</span>
                      <span className="detail-value">
                        {new Date(
                          family.registration_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="family-card-footer">
                  <Button
                    variant="outline"
                    className="flex-fill"
                    onClick={() => router.push(`/families/${family.family_id}`)}
                  >
                    View & Manage
                  </Button>
                  <Button variant="ghost">Edit</Button>
                </div>
              </Card>
            ))}
          </div> 

          {/* Pagination */}
          {!debouncedSearchQuery && totalPages > 1 && (
            <div className="pagination">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && !isSearching && filteredFamilies.length === 0 && (
        <div className="no-results">
          <p>
            {debouncedSearchQuery
              ? "No families found matching your search criteria."
              : "No families found matching your criteria."}
          </p>
        </div>
      )}

      <CreateFamilyModal
        isOpen={isCreateFamilyModalOpen}
        onClose={() => setIsCreateFamilyModalOpen(false)}
        hookForm={createFamilyHookForm}
        isCreating={isCreatingFamily}
        onSubmit={onCreateFamilySubmit}
        wards={formattedWardsList}
      />
    </div>
  );
};

const FamiliesPage = () => (
  <StoreProvider>
    <FamiliesPageComp />
  </StoreProvider>
);

export default FamiliesPage;
