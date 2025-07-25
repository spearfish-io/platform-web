import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    
    let button = screen.getByRole('button', { name: /delete/i })
    expect(button).toHaveClass('bg-destructive')
    
    rerender(<Button variant="outline">Outlined</Button>)
    button = screen.getByRole('button', { name: /outlined/i })
    expect(button).toHaveClass('border')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button', { name: /ghost/i })
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    
    let button = screen.getByRole('button', { name: /small/i })
    expect(button).toHaveClass('h-8')
    
    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button', { name: /large/i })
    expect(button).toHaveClass('h-10')
    
    rerender(<Button size="icon">Icon</Button>)
    button = screen.getByRole('button', { name: /icon/i })
    expect(button).toHaveClass('h-9', 'w-9')
  })

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button).toHaveClass('custom-class')
  })

  it('supports keyboard navigation', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Press me</Button>)
    
    const button = screen.getByRole('button', { name: /press me/i })
    button.focus()
    
    expect(button).toHaveFocus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledOnce()
    
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('has proper accessibility attributes', () => {
    render(
      <Button 
        aria-label="Custom aria label"
        aria-describedby="helper-text"
      >
        Accessible button
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /custom aria label/i })
    expect(button).toHaveAttribute('aria-label', 'Custom aria label')
    expect(button).toHaveAttribute('aria-describedby', 'helper-text')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    
    render(<Button ref={ref}>Ref button</Button>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })
})