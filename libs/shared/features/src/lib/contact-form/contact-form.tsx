'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { IContactFormInput } from '@rocket-house-productions/types';
import React, { useState } from 'react';
//import ReCAPTCHA from 'react-google-recaptcha';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { z } from 'zod';
import cn from 'classnames';

const emailSchema = z.object({
  'form-name': z.string().optional(),
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  enquiryType: z.string().min(1, 'Please select the nature of your enquiry'),
  message: z.string().min(1, 'Please enter your message'),
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to the Terms & Conditions'),
});

export function ContactForm() {
  //const captchaRef: any = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  //const key: string = process.env.NEXT_PUBLIC_RECAP_SITE_KEY || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IContactFormInput>({
    resolver: zodResolver(emailSchema),
  });

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  };

  const onSubmit: SubmitHandler<IContactFormInput> = async (data: IContactFormInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...data }),
      });
      if (response.status === 200) {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        toast.success('Your message has been sent!');
        reset(); // Optionally reset form fields
      } else {
        setIsSubmitting(false);
        toast.error('There was an error sending your message. Please try again later.');
      }
    } catch (error) {
      console.log('error', error);
      setIsSubmitting(false);
      toast.error('There was an error sending your message. Please try again later.');
      return;
    }
  };

  const handleContinue = () => {
    setSubmissionSuccess(false);
    setIsSubmitting(false);
  };

  if (submissionSuccess) {
    return (
      <div className={'container mx-auto flex max-w-2xl flex-col items-center justify-center'}>
        <div className="text-center font-bold">
          Your message has been sent successfully! We will get back to you soon.
        </div>
        <div>
          <button className={'btn btn-primary mt-5'} onClick={handleContinue}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-control text-primary w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate data-netlify="true" method="post" className="space-y-4">
        <input type="hidden" name="form-name" value="contact" />
        <input
          type="text"
          placeholder="Name"
          className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-error">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-error">{errors.email.message}</p>}

        <select
          className={`select select-bordered w-full ${errors.enquiryType ? 'select-error' : ''}`}
          {...register('enquiryType')}
          disabled={isSubmitting}>
          <option value="" disabled defaultValue="">
            Nature of Enquiry
          </option>
          <option value="general">General Inquiry</option>
          <option value="billing">Can we chat!</option>
          <option value="support">Pricing and Quoting</option>
          <option value="feedback">Collaboration</option>
          <option value="other">Other</option>
        </select>
        {errors.enquiryType && <p className="text-error">{errors.enquiryType.message}</p>}

        <textarea
          placeholder="Message"
          className={`textarea textarea-bordered w-full ${errors.message ? 'textarea-error' : ''}`}
          {...register('message')}
          rows={4}
          disabled={isSubmitting}
        />
        {errors.message && <p className="text-error">{errors.message.message}</p>}

        <div className="flex flex-col items-center">
          <div className="w-full">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className={`checkbox ${errors.agreeToTerms ? 'checkbox-error' : ''}`}
                {...register('agreeToTerms')}
                id="agreeToTerms"
              />
              <label htmlFor="agreeToTerms" className="label-text">
                I agree to the Terms & Conditions
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-error">{errors.agreeToTerms.message}</p>}
          </div>

          <div className="flex w-full justify-end pt-6">
            {/* Submit Button */}
            <Button
              type="submit"
              size={'lg'}
              className={cn(`${isSubmitting ? 'loading' : ''}`, 'w-full')}
              disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
}

export default ContactForm;
