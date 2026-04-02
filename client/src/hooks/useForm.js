import { useCallback } from 'react';
import { useForm as useRHF } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/**
 * useForm
 * Thin wrapper around react-hook-form that adds:
 *  - optional Yup schema validation
 *  - unified onSubmit error handling
 *
 * @param {Object}   initialValues     - default form values
 * @param {Object}   validationSchema  - Yup schema (optional)
 * @param {Function} onSubmit          - async submit handler
 * @returns react-hook-form API + helpers
 */
export function useForm(initialValues = {}, validationSchema, onSubmit) {
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useRHF({
    defaultValues: initialValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    mode: 'onTouched',
  });

  const onSubmitHandler = useCallback(
    async (data) => {
      try {
        if (onSubmit) await onSubmit(data);
      } catch (err) {
        console.error('[useForm] submit error:', err);
      }
    },
    [onSubmit]
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmitHandler),
    reset,
    resetField,
    setValue,
    getValues,
    watch,
    errors,
    isSubmitting,
    isDirty,
    isValid,
  };
}
