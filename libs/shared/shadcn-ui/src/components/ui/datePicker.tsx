'use client';
import cn from 'classnames';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { FC, useState } from 'react';
import dayjs from 'Dayjs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { CalendarIcon } from 'lucide-react';
import { FormControl } from './form';

interface DatePickerProps {
  value: Date | undefined;
  onChange: any | undefined;
  selected?: any;
  selectionType?: 'date' | 'month' | 'year' | 'recurringDate';
  fromDate?: Date;
  ref?: any;
  placeholder?: string;
  toDate?: Date;
  name?: string;
}

export const DatePicker: FC<DatePickerProps> = ({
  onChange,
  selected,
  value = undefined,
  selectionType,
  fromDate = undefined,
  placeholder = 'Select date',
  toDate = undefined,
  ref = undefined,
}) => {
  // SET MONTH AND YEAR
  const [year, setYear] = useState<string | undefined>(dayjs().format('YYYY'));
  const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(dayjs().toDate());
  const [open, setOpen] = useState(false);

  const startYear = dayjs().year();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'h-[38px] w-full justify-start py-2 text-left font-normal',
              !value && 'text-muted-foreground',
            )}
            onClick={() => setOpen(!open)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              selectionType === 'recurringDate' ? (
                dayjs(value).format('MMMM DD')
              ) : (
                dayjs(value).format('MMMM DD, YYYY')
              )
            ) : (
              <p className="text-[13px]">{placeholder}</p>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <menu className="flex w-full flex-col gap-2 p-2">
          <ul className={`grid w-full gap-3 ${selectionType === 'recurringDate' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {selectionType !== 'recurringDate' && (
              <Select
                value={year}
                onValueChange={(e: any) => {
                  setYear(e);
                  setDefaultMonth(dayjs(e, 'YYYY-MM-DD').toDate());
                }}>
                <SelectTrigger ref={ref}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => (
                    <SelectItem key={(startYear - i).toString()} value={(startYear - i).toString()}>
                      {startYear - i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={dayjs(defaultMonth).format('MM')}
              onValueChange={(e: any) => {
                setDefaultMonth(dayjs(`${year}-${e}`, 'YYYY-MM-DD').toDate());
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem
                    key={String(i + 1)
                      .padStart(2, '0')
                      .toString()}
                    value={String(i + 1)
                      .padStart(2, '0')
                      .toString()}>
                    {dayjs().month(i).format('MMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ul>
          <Calendar
            fromDate={fromDate}
            toDate={toDate}
            mode="single"
            month={defaultMonth}
            onMonthChange={e => {
              if (selectionType !== 'recurringDate') {
                setDefaultMonth(e);
              }
            }}
            selected={selected || ''}
            onSelect={e => {
              if (e) {
                const selectedDate = dayjs(e).toDate(); // Convert to Date object

                onChange(selectedDate.toString()); // Pass Date object to the onChange handler
                setOpen(false);
                /*
                console.log('date', typeof dayjs(e).format());
                onChange(dayjs(e).format());
                setOpen(false);

                 */
              }
            }}
            initialFocus
          />
        </menu>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
