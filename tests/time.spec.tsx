import { fireEvent, render } from '@testing-library/react';
import { resetWarned } from 'rc-util/lib/warning';
import React from 'react';
import { DayPicker, getDay, openPicker, selectCell, findCell } from './util/commonUtil';

describe('Picker.Time', () => {
  beforeEach(() => {
    resetWarned();
    jest.useFakeTimers().setSystemTime(getDay('1990-09-03 00:00:00').valueOf());
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('show columns for one of it is false', async () => {
    const { container } = render(<DayPicker showTime showMinute={false} />);

    openPicker(container);
    expect(document.querySelectorAll('.rc-picker-time-panel-column')).toHaveLength(2);

    // Select
    selectCell(3);

    expect(container.querySelector('input')).toHaveValue('9/3/1990 00:00:00');
  });

  it('hover to show placeholder', async () => {
    const { container } = render(
      <DayPicker
        showTime={{
          showMillisecond: true,
          use12Hours: true,
        }}
      />,
    );
    openPicker(container);

    const getColCell = (colIndex: number, cellIndex: number) => {
      const column = document.querySelectorAll('.rc-picker-time-panel-column')[colIndex];
      const cell = column.querySelectorAll('.rc-picker-time-panel-cell-inner')[cellIndex];

      return cell;
    };

    // Hour
    fireEvent.mouseEnter(getColCell(0, 3));
    expect(container.querySelector('input')).toHaveValue('9/3/1990 03:00:00');

    // Let test for mouse leave
    fireEvent.mouseLeave(getColCell(0, 3));
    expect(container.querySelector('input')).toHaveValue('');

    // Minute
    fireEvent.mouseEnter(getColCell(1, 2));
    expect(container.querySelector('input')).toHaveValue('9/3/1990 00:02:00');

    // Second
    fireEvent.mouseEnter(getColCell(2, 1));
    expect(container.querySelector('input')).toHaveValue('9/3/1990 00:00:01');

    // Millisecond
    fireEvent.mouseEnter(getColCell(3, 1));
    expect(container.querySelector('input')).toHaveValue('9/3/1990 00:00:00');

    // Meridiem
    fireEvent.mouseEnter(getColCell(4, 1));
    expect(container.querySelector('input')).toHaveValue('9/3/1990 12:00:00');
  });
});
