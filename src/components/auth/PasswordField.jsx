import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({
  id,
  name,
  value,
  onChange,
  autoComplete,
  placeholder,
  required = false,
  invalid = false,
}) => {
  const [visible, setVisible] = useState(false);
  const label = visible ? 'Hide password' : 'Show password';

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`field pr-11 ${invalid ? 'border-red-300 focus:ring-red-500' : ''}`}
      />
      <button
        type="button"
        onClick={() => setVisible((open) => !open)}
        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-ink"
        aria-label={label}
        title={label}
      >
        {visible ? (
          <EyeOff className="w-4 h-4" strokeWidth={1.75} aria-hidden />
        ) : (
          <Eye className="w-4 h-4" strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
