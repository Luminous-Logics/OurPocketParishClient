"use client";
import React from "react";
import ReactModal from "react-modal";
import Button from "@/components/Button";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import InputText from "../InputComponents/InputText";
import InputNumber from "../InputComponents/InputNumber";
import InputTextArea from "../InputComponents/InputTextArea";
import InputDropDown from "../InputComponents/InputDropDown";
import "./styles.scss";
import { dropDownSchemaOpt } from "@/zod";

// Validation schema
export const createFamilySchema = z.object({
  parish_id: z.number().min(1, "Parish ID is required"),
  family_name: z.string().min(1, "Family Name is required"),
  head_of_family: z.string().min(1, "Head of Family is required"),
  ward_id: dropDownSchemaOpt,
  member_count: z.string().min(1, "Number of Members is required"),
  home_phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateFamilyFormType = z.infer<typeof createFamilySchema>;

interface CreateFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hookForm: UseFormReturn<CreateFamilyFormType>;
  isCreating: boolean;
  onSubmit: (data: CreateFamilyFormType) => Promise<void>;
  isEditMode?: boolean;
  wards: { label: string; value: string }[]; // Changed value to string
}

const CreateFamilyModal: React.FC<CreateFamilyModalProps> = ({
  isOpen,
  onClose,
  hookForm,
  isCreating,
  onSubmit,
  isEditMode = false,
  wards,
}) => {
  const { handleSubmit, formState: { errors } } = hookForm;
  console.log(errors);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={isEditMode ? "Edit Family" : "Add New Family"}
      className="modal-content modal-lg"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h3 className="modal-title">{isEditMode ? "Edit Family" : "Add New Family"}</h3>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="modal-body">
        <form onSubmit={handleSubmit(onSubmit)} id="create-family-form">
          <div className="row g-3">
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="family_name"
                label="Family Name"
                labelMandatory
                errorText="Family Name is required"
                placeholder="e.g., The Johnsons"
              />
            </div>

            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="head_of_family"
                label="Head of Family"
                labelMandatory
                errorText="Head of Family is required"
                placeholder="e.g., John Johnson"
              />
            </div>

            <div className="col-md-6">
              <InputDropDown
                hookForm={hookForm}
                field="ward_id"
                label="Ward"
                labelMandatory
                errorText="Ward is required"
                placeholder="Select ward"
                options={wards}
              />
            </div>

            <div className="col-md-6">
              <InputNumber
                hookForm={hookForm}
                field="member_count"
                label="Number of Members"
                labelMandatory
                errorText="Number of Members is required"
                placeholder="e.g., 4"
                min={1}
              />
            </div>

            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="home_phone"
                label="Phone"
                placeholder="e.g., +1 555 123 4567"
              />
            </div>

            <div className="col-12">
              <InputTextArea
                hookForm={hookForm}
                field="address"
                label="Address"
                placeholder="Enter family address"
                rows={3}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="modal-footer">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-family-form"
          variant="primary"
          isLoading={isCreating}
          disabled={isCreating}
        >
          {isCreating
            ? isEditMode ? "Updating..." : "Creating..."
            : isEditMode ? "Update Family" : "Add Family"}
        </Button>
      </div>
    </ReactModal>
  );
};

export default CreateFamilyModal;
