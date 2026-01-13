'use client';
import React, { useState } from 'react';
import { Upload, X, Plus, Save } from 'lucide-react';
import Button from '@/components/Button';

export default function GenericForm({
  title,
  fields,
  onSubmit,
  initialData = {},
  isLoading = false,
}) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, child, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-card p-8 rounded-[2.5rem] border border-border/50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-text">
          {title} <span className="text-primary">.SYS</span>
        </h2>
        <Button
          text={isLoading ? 'Syncing...' : 'Save Changes'}
          type="submit"
          icon={Save}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={`${field.fullWidth ? 'md:col-span-2' : ''} space-y-2`}>
            <label className="text-[10px] font-black uppercase tracking-widest text-pText/60 ml-2">
              {field.label}
            </label>

            {field.type === 'text' || field.type === 'number' ? (
              <input
                type={field.type}
                required={field.required}
                className="w-full bg-bg border border-border/50 rounded-2xl px-6 py-4 text-text focus:border-primary outline-none transition-all font-bold"
                value={
                  field.nested ? formData[field.nested]?.[field.name] : formData[field.name] || ''
                }
                onChange={(e) =>
                  field.nested
                    ? handleNestedChange(field.nested, field.name, e.target.value)
                    : handleChange(field.name, e.target.value)
                }
              />
            ) : field.type === 'select' ? (
              <select
                className="w-full bg-bg border border-border/50 rounded-2xl px-6 py-4 text-text focus:border-primary outline-none transition-all font-bold appearance-none"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                rows={4}
                className="w-full bg-bg border border-border/50 rounded-2xl px-6 py-4 text-text focus:border-primary outline-none transition-all font-bold"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : null}
          </div>
        ))}
      </div>
    </form>
  );
}
