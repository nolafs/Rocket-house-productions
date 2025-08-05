'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import { FormErrors } from '../../_component/path-types';
import { PrevButton } from '../../_component/button-prev';
import { useForm } from 'react-hook-form';
import stepOneFormAction from '../action';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from '@rocket-house-productions/shadcn-ui';
import z from 'zod';
import { stepOneSchema } from '../../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useActionState } from 'react';
import { XIcon } from 'lucide-react';
import { useOnBoardingContext } from '../../_component/onBoardinglContext';
import ButtonSubmit from '../../_component/button-submit';
import { KeyTextField, RichTextField } from '@prismicio/types';
import { PrismicRichText } from '@prismicio/react';
import { useMenuActive } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/useMenuActive';

const initialState: FormErrors = {};

interface StepOneFormProps {
  baseUrl: string;
  purchase?: {
    id: string | undefined;
    account: {
      id: string | undefined;
      firstName: string | null | undefined;
      lastName: string | null | undefined;
      email: string | null | undefined;
    };
  };
  header?: KeyTextField | string | null | undefined;
  body?: RichTextField | string | null | undefined;
}

export default function StepOneForm({ baseUrl, purchase, header, body }: StepOneFormProps) {
  const [serverError, formAction] = useActionState(stepOneFormAction, initialState);
  const { updateOnBoardingDetails, onBoardingData } = useOnBoardingContext();
  const setActive = useMenuActive(state => state.setActive);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setActive(true);
  }, []);

  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      firstName: onBoardingData.firstName || purchase?.account.firstName || '',
      lastName: onBoardingData.lastName || purchase?.account.lastName || '',
      email: onBoardingData.email || purchase?.account.email || '',
      confirmTerms: onBoardingData.confirmTerms || false,
      parentConsent: onBoardingData.parentConsent || false,
      newsletter: onBoardingData.newsletter || false,
      notify: onBoardingData.notify || false,
      productId: baseUrl,
    },
  });

  return (
    <DialogLayout title={header || "🎸 Parent's Jam Session 🎸"}>
      {body && <div className="body">{typeof body === 'string' ? body : <PrismicRichText field={body} />}</div>}
      <div className={'flex-1 text-left'}>test</div>
    </DialogLayout>
  );
}
