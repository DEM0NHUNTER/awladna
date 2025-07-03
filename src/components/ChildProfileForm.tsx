// src/components/ChildProfileForm.tsx
import React from "react";
import  Input  from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface Props {
  formData: {
    name: string;
    birth_date: string;
    gender: string;
    behavioral_patterns: { mood: string };
    emotional_state: { status: string };
  };
  formErrors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ChildProfileForm: React.FC<Props> = ({
  formData,
  formErrors,
  onChange,
  onSelectChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input name="name" value={formData.name} onChange={onChange} />
        {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
      </div>

      <div>
        <Label>Date of Birth</Label>
        <Input name="birth_date" type="date" value={formData.birth_date} onChange={onChange} />
        {formErrors.birth_date && <p className="text-sm text-red-500 mt-1">{formErrors.birth_date}</p>}
      </div>

      <div>
        <Label>Gender</Label>
        <Select value={formData.gender} onValueChange={(val) => onSelectChange("gender", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Mood (Behavioral)</Label>
        <Input
          name="behavioral_patterns.mood"
          value={formData.behavioral_patterns.mood}
          onChange={(e) => onSelectChange("behavioral_patterns.mood", e.target.value)}
        />
      </div>

      <div>
        <Label>Status (Emotional)</Label>
        <Input
          name="emotional_state.status"
          value={formData.emotional_state.status}
          onChange={(e) => onSelectChange("emotional_state.status", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={() => onCancel?.()}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default ChildProfileForm;