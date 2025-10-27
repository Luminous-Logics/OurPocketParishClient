/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {  getFamilyDetailsById } from "@/store/slices/families";
import { getParishionersByFamilyId } from "@/store/slices/parishioners";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import StoreProvider from "@/store/provider";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Family, Parishioner } from "@/types";
import { ArrowLeft, Plus, User, Home, MapPin, Phone, Calendar, Briefcase, Mail } from "lucide-react";
import CreateParishionerModal from "@/components/Modal/CreateParishionerModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateParishionerFormType, createParishionerSchema } from "@/zod";
import { createParishioner } from "@/lib/actions/parishioner";
import { fetchAllWards } from "@/store/slices/wards";
import { SelectItem } from "@/types";
import toaster from "@/lib/toastify";

const FamilyDetailsPageComp = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const familyId = params.familyId as string;
  const { userProfile } = useAppSelector((state) => state.profile);
  const parishId = userProfile?.parish?.parish_id;
  const wardsParishId = userProfile?.ward?.ward_id;
console.log(wardsParishId,"ward")
  const [parishioners, setParishioners] = useState<Parishioner[]>([]);
  const [familyDetails, setFamilyDetails] = useState<Family | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [wards, setWards] = useState<SelectItem[]>([]);

  const [isLoadingFamily, setIsLoadingFamily] = useState(true);
  const [isCreatingParishioner, setIsCreatingParishioner] = useState(false);


  const { parishionersList, isLoading: isLoadingParishioners } = useAppSelector(
    (state) => state.parishioners
  );

  const addMemberHookForm = useForm<CreateParishionerFormType>({
    resolver: zodResolver(createParishionerSchema),
    defaultValues: {
      parish_id: parishId ? +parishId : undefined,
      family_id: +familyId,
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      ward_id: {value: "", label: "" },
    },
  });

  const fetchWards = async () => {
    if (parishId) {
      const response = await dispatch(fetchAllWards(+parishId));
      if (response && Array.isArray(response)) {
        const formattedWards = response.map((ward) => ({
          label: ward.ward_name,
          value: ward.ward_id.toString(),
        }));
        setWards(formattedWards);
      }
    }
  };

  useEffect(() => {
    const fetchFamilyAndParishioners = async () => {
      setIsLoadingFamily(true);
      if (familyId) {
       const familyDetails = await dispatch(getFamilyDetailsById(familyId));
       setFamilyDetails(familyDetails as Family);
        const members = await dispatch(getParishionersByFamilyId(+familyId));
        if (members) {
          setParishioners(members as Parishioner[]);
        }
      }
      setIsLoadingFamily(false);
    };

    fetchFamilyAndParishioners();
    fetchWards();
  }, [dispatch, familyId, parishId]);

  const handleAddMember = async (data: CreateParishionerFormType) => {
    setIsCreatingParishioner(true);
    try {
      const payload = {
        ...data,
        ward_id: +data.ward_id.value,
        gender:data.gender.value,
        member_status: "active",
        marital_status: data.marital_status.value,
      };
      await createParishioner(payload);
      toaster.success("Parishioner created successfully!");
      setIsAddMemberModalOpen(false);
      addMemberHookForm.reset();
      const members = await dispatch(getParishionersByFamilyId(+familyId));
      if (members) {
        setParishioners(members as Parishioner[]);
      }
    } catch (error: any) {
      toaster.error(error.message || "Failed to create parishioner.");
    } finally {
      setIsCreatingParishioner(false);
    }
  };

console.log(parishId,familyId)
  if (isLoadingFamily || isLoadingParishioners) {
    return <div>Loading family details...</div>;
  }

  if (!parishioners) {
    return <div>Family not found.</div>;
  }
console.log(isAddMemberModalOpen)
  return (
    <div className="family-details-page">
      <div className="header">
        <div>
          <h1>{familyDetails?.family_name}</h1>
          <p>Family details and members</p>
        </div>
        <div className="actions">
          <Button onClick={() => router.back()} variant="secondary" icon={<ArrowLeft size={16} />}>
            Back to Families
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => setIsAddMemberModalOpen(true)}>
            Add Member
          </Button>
        </div>
      </div>

      <div className="family-info-cards">
        <Card className="family-information">
          <h2>Family Information</h2>
          <div className="info-item">
            <User size={16} /> <span>Head: </span><span>{familyDetails?.head_of_family}</span>
          </div>
          <div className="info-item">
            <Home size={16} /> <span>House Name: </span><span>{familyDetails?.family_name}</span>
          </div>
          <div className="info-item">
            <MapPin size={16} /> <span>Ward: </span><Badge>{familyDetails?.ward_id}</Badge> {/* Temporarily display ward_id */}
          </div>
        </Card>

        <Card className="contact-information">
          <h2>Contact Information</h2>
          <div className="info-item">
            <Phone size={16} /> <span>{familyDetails?.home_phone}</span>
          </div>
          <div className="info-item">
            <Mail size={16} /> <span>{familyDetails?.email || "N/A"}</span>
          </div>
          <div className="info-item">
            <MapPin size={16} /> <span>{familyDetails?.address || "N/A"}</span>
          </div>
        </Card>
      </div>

      <h2>Family Members ({parishionersList?.length || 0})</h2>
      <div className="family-members-list">
        {parishionersList && parishionersList.length > 0&& parishionersList?.map((member) => (
          <Card key={member.family_id} className="member-card">
            <div className="member-header">
              <Avatar fallback={`${member.first_name} ${member.last_name}`} />
              <div>
                <h3>{`${member.first_name} ${member.last_name}`}</h3>
                <Badge>{member.relationship}</Badge>
              </div>
            </div>
            <div className="member-details">
              <div className="detail-item">
                <Calendar size={16} /> DOB: <span>{member.date_of_birth}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} /> Born: <span>{member.place_of_birth}</span>
              </div>
              <div className="detail-item">
                <Phone size={16} /> <span>{member.phone_number}</span>
              </div>
              <div className="detail-item">
                <Mail size={16} /> <span>{member.email}</span>
              </div>
              <div className="detail-item">
                <Briefcase size={16} /> <span>{member.occupation}</span>
              </div>
            </div>
            <div className="member-actions">
              <Button  variant="secondary">View Full Profile</Button>
              <Button variant="outline">Edit</Button>
            </div>
          </Card>
        ))}</div>

      {parishId && familyId && (
        <CreateParishionerModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          hookForm={addMemberHookForm}
          isCreating={isCreatingParishioner}
          onSubmit={handleAddMember}
          wards={wards}
          parishId={+parishId}
          familyId={+familyId}
        />
      )}
    </div>
  );
};

const FamilyDetailsPage = () => {
    
  return (
    <StoreProvider>
        <FamilyDetailsPageComp />   
    </StoreProvider>
  )
}

export default FamilyDetailsPage;
