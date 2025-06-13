// Input.tsx
import { UseFormRegister } from 'react-hook-form';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  register: UseFormRegister<any>;
  errors?: string;
  validation?: object;
}

export default function AuthInput({ id, label, type, register, errors, validation = {} }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-black">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          {...register(id, validation)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {errors && <span className="text-red-500 text-sm">{errors}</span>}
    </div>
  );
}
