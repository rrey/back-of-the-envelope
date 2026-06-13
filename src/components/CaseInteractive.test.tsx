import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import CaseInteractive from './CaseInteractive';

const baseProps = {
  hints: ['hint one', 'hint two'],
  answer: { value: 100, unit: 'GB/day', tolerance: 0.5 },
  explanation: 'because reasons',
  keyValues: [{ label: 'rate', value: '200M/day' }],
};

describe('CaseInteractive — answer checking', () => {
  it('shows the unit next to the input', () => {
    render(<CaseInteractive {...baseProps} />);
    expect(screen.getByText('GB/day')).toBeInTheDocument();
  });

  it('disables submit until a numeric value is entered', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText(/your answer/i), '80');
    expect(button).toBeEnabled();
  });

  it('shows the correct verdict when within tolerance', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    await user.type(screen.getByLabelText(/your answer/i), '80');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByText('because reasons')).toBeInTheDocument();
  });

  it('shows the incorrect verdict when outside tolerance', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    await user.type(screen.getByLabelText(/your answer/i), '10');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
    expect(screen.getByText('because reasons')).toBeInTheDocument();
  });

  it('disables submit after submitting (one-shot)', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    await user.type(screen.getByLabelText(/your answer/i), '100');
    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);
    expect(button).toBeDisabled();
  });
});

describe('CaseInteractive — hint reveal', () => {
  it('shows no hints initially', () => {
    render(<CaseInteractive {...baseProps} />);
    expect(screen.queryByText('hint one')).not.toBeInTheDocument();
    expect(screen.queryByText('hint two')).not.toBeInTheDocument();
  });

  it('reveals hints one at a time', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    const button = screen.getByRole('button', { name: /reveal hint/i });

    await user.click(button);
    expect(screen.getByText('hint one')).toBeInTheDocument();
    expect(screen.queryByText('hint two')).not.toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('hint two')).toBeInTheDocument();
  });

  it('disables the reveal button when all hints are shown', async () => {
    const user = userEvent.setup();
    render(<CaseInteractive {...baseProps} />);
    const button = screen.getByRole('button', { name: /reveal hint/i });
    await user.click(button);
    await user.click(button);
    expect(button).toBeDisabled();
  });
});
