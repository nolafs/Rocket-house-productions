import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  FormControl,
  FormItem,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rocket-house-productions/shadcn-ui';
import { cn } from '@rocket-house-productions/util';
import { Check, ChevronsUpDown } from 'lucide-react';

interface AttachmentCategoryFormProps {
  types: { value: string; label: string }[];
  field: any;
  form: any;
}

export function AttachmentCategoryForm({ types, field, form }: AttachmentCategoryFormProps) {
  return (
    <FormItem className="mt-3 flex w-full flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
              {field.value ? types.find(type => type.value === field.value)?.label : 'Select type'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No types found.</CommandEmpty>
              <CommandGroup>
                {types.map(type => (
                  <CommandItem
                    value={type.label}
                    key={type.value}
                    onSelect={() => {
                      console.log('type', field);
                      field.value = type.value;
                      form.setValue('attachmentType', type.value);
                    }}>
                    <Check className={cn('mr-2 h-4 w-4', type.value === field.value ? 'opacity-100' : 'opacity-0')} />
                    {type.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

export default AttachmentCategoryForm;
