"use client";
import React from "react";
import ReactModal from "react-modal";
import Button from "@/components/Button";
import { UseFormReturn } from "react-hook-form";
import InputText from "../InputComponents/InputText";
import InputTextArea from "../InputComponents/InputTextArea";
import InputDropDown from "../InputComponents/InputDropDown";
import InputDatePicker from "../InputComponents/InputDatePicker";
import "./styles.scss";
import { CreateParishionerFormType } from "@/zod";

interface CreateParishionerModalProps {
  isOpen: boolean;
  onClose: () => void;
  hookForm: UseFormReturn<CreateParishionerFormType>;
  isCreating: boolean;
  onSubmit: (data: CreateParishionerFormType) => Promise<void>;
  isEditMode?: boolean;
  wards: { label: string; value: string }[];
  parishId: number;
  familyId: number;
}

const CreateParishionerModal: React.FC<CreateParishionerModalProps> = ({
  isOpen,
  onClose,
  hookForm,
  isCreating,
  onSubmit,
  isEditMode = false,
  wards,
  parishId,
  familyId,
}) => {
  const { handleSubmit, formState: { errors }, setValue } = hookForm;

  React.useEffect(() => {
    setValue("parish_id", parishId);
    setValue("family_id", familyId);
  }, [parishId, familyId, setValue]);

  console.log(errors);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={isEditMode ? "Edit Parishioner" : "Add New Parishioner"}
      className="modal-content modal-lg"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h3 className="modal-title">{isEditMode ? "Edit Parishioner" : "Add New Parishioner"}</h3>
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
        <form onSubmit={handleSubmit(onSubmit)} id="create-parishioner-form">
          <div className="row g-3">
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="first_name"
                label="First Name"
                labelMandatory
                errorText="First Name is required"
                placeholder="e.g., John"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="middle_name"
                label="Middle Name"
                placeholder="e.g., Michael"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="last_name"
                label="Last Name"
                labelMandatory
                errorText="Last Name is required"
                placeholder="e.g., Doe"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="email"
                label="Email"
                labelMandatory
                errorText="Email is required"
                placeholder="e.g., john.doe@example.com"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="password"
                label="Password"
                labelMandatory
                errorText="Password is required"
                type="password"
                placeholder="SecurePass123!"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="phone"
                label="Phone"
                labelMandatory
                errorText="Phone number is required"
                placeholder="e.g., +1234567890"
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
              <InputDatePicker
                hookForm={hookForm}
                field="date_of_birth"
                label="Date of Birth"
              />
            </div>
            <div className="col-md-6">
              <InputDropDown
                hookForm={hookForm}
                field="gender"
                label="Gender"
                placeholder="Select gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>
            <div className="col-md-6">
               <InputDropDown
                hookForm={hookForm}
                field="marital_status"
                  label="Marital Status"
                placeholder="Select Status"
                options={[
                  { label: "single", value: "single" },
                  { label: "divorced", value: "divorced" },
                  { label: "widowed", value: "widowed" },
                  { label: "married", value: "married" },
                  { label: "separated", value: "separated" },
                ]}
              />
            
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="occupation"
                label="Occupation"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="col-md-6">
              <InputDatePicker
                hookForm={hookForm}
                field="baptism_date"
                label="Baptism Date"
              />
            </div>
            <div className="col-md-6">
              <InputDatePicker
                hookForm={hookForm}
                field="first_communion_date"
                label="First Communion Date"
              />
            </div>
            <div className="col-md-6">
              <InputDatePicker
                hookForm={hookForm}
                field="confirmation_date"
                label="Confirmation Date"
              />
            </div>
            <div className="col-md-6">
              <InputDatePicker
                hookForm={hookForm}
                field="marriage_date"
                label="Marriage Date"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="member_status"
                label="Member Status"
                placeholder="e.g., Active"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="photo_url"
                label="Photo URL"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="address_line1"
                label="Address Line 1"
                placeholder="e.g., 456 Oak Street"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="address_line2"
                label="Address Line 2"
                placeholder="e.g., Apt 2B"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="city"
                label="City"
                placeholder="e.g., Springfield"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="state"
                label="State"
                placeholder="e.g., Illinois"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="country"
                label="Country"
                placeholder="e.g., USA"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="postal_code"
                label="Postal Code"
                placeholder="e.g., 62701"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="emergency_contact_name"
                label="Emergency Contact Name"
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div className="col-md-6">
              <InputText
                hookForm={hookForm}
                field="emergency_contact_phone"
                label="Emergency Contact Phone"
                placeholder="e.g., +1987654321"
              />
            </div>
            <div className="col-12">
              <InputTextArea
                hookForm={hookForm}
                field="notes"
                label="Notes"
                placeholder="e.g., Volunteer for youth ministry"
                rows={3}
              />
            </div>
            <div className="col-md-6">
              <InputDatePicker
                hookForm={hookForm}
                field="registration_date"
                label="Registration Date"
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
          form="create-parishioner-form"
          variant="primary"
          isLoading={isCreating}
          disabled={isCreating}
        >
          {isCreating
            ? isEditMode ? "Updating..." : "Creating..."
            : isEditMode ? "Update Parishioner" : "Add Parishioner"}
        </Button>
      </div>
    </ReactModal>
  );
};

export default CreateParishionerModal;
