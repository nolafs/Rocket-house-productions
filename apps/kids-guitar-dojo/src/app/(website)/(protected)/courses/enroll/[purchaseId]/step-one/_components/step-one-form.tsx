'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
//import { FormErrors } from '../../_component/path-types';
/*
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

import { useMenuActive } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/useMenuActive';
import { isFilled } from '@prismicio/client';
 */
import { KeyTextField, RichTextField } from '@prismicio/types';
import { PrismicRichText } from '@prismicio/react';

//const initialState: FormErrors = {};

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
  body?: RichTextField;
}

export default function StepOneForm({ baseUrl, purchase, header, body }: StepOneFormProps) {
  return <DialogLayout title={header || "🎸 Parent's Jam Session 🎸"}>test</DialogLayout>;
}
