import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Theme } from '@radix-ui/themes'
import { PersonIcon } from '@radix-ui/react-icons'
import { MetricCard } from './metric-card'
import type { DashboardMetric } from '@/types'

// Wrapper component to provide Radix UI Theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Theme>{children}</Theme>
)

describe('MetricCard', () => {
  const mockMetric: DashboardMetric = {
    id: '1',
    title: 'Total Users',
    value: 1234,
    icon: PersonIcon,
  }

  it('renders basic metric information', () => {
    render(
      <TestWrapper>
        <MetricCard metric={mockMetric} />
      </TestWrapper>
    )

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('formats numeric values with commas', () => {
    const metric: DashboardMetric = {
      ...mockMetric,
      value: 1234567,
    }

    render(
      <TestWrapper>
        <MetricCard metric={metric} />
      </TestWrapper>
    )

    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('displays string values as-is', () => {
    const metric: DashboardMetric = {
      ...mockMetric,
      value: '$45.67K',
    }

    render(
      <TestWrapper>
        <MetricCard metric={metric} />
      </TestWrapper>
    )

    expect(screen.getByText('$45.67K')).toBeInTheDocument()
  })

  it('renders positive change indicator', () => {
    const metric: DashboardMetric = {
      ...mockMetric,
      change: {
        type: 'increase',
        value: 12.5,
      },
    }

    render(
      <TestWrapper>
        <MetricCard metric={metric} />
      </TestWrapper>
    )

    expect(screen.getByText('+12.5%')).toBeInTheDocument()
    expect(screen.getByText('from last month')).toBeInTheDocument()
  })

  it('renders negative change indicator', () => {
    const metric: DashboardMetric = {
      ...mockMetric,
      change: {
        type: 'decrease',
        value: -8.3,
      },
    }

    render(
      <TestWrapper>
        <MetricCard metric={metric} />
      </TestWrapper>
    )

    expect(screen.getByText('-8.3%')).toBeInTheDocument()
    expect(screen.getByText('from last month')).toBeInTheDocument()
  })

  it('handles zero change', () => {
    const metric: DashboardMetric = {
      ...mockMetric,
      change: {
        type: 'increase',
        value: 0,
      },
    }

    render(
      <TestWrapper>
        <MetricCard metric={metric} />
      </TestWrapper>
    )

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('does not render change indicator when not provided', () => {
    render(
      <TestWrapper>
        <MetricCard metric={mockMetric} />
      </TestWrapper>
    )

    expect(screen.queryByText('from last month')).not.toBeInTheDocument()
    expect(screen.queryByText('%')).not.toBeInTheDocument()
  })

  it('renders without icon when not provided', () => {
    const metricWithoutIcon: DashboardMetric = {
      id: '1',
      title: 'Total Users',
      value: 1234,
    }

    render(
      <TestWrapper>
        <MetricCard metric={metricWithoutIcon} />
      </TestWrapper>
    )

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(
      <TestWrapper>
        <MetricCard metric={mockMetric} />
      </TestWrapper>
    )

    // The card should be contained within a proper container
    const titleElement = screen.getByText('Total Users')
    const valueElement = screen.getByText('1,234')

    expect(titleElement).toBeInTheDocument()
    expect(valueElement).toBeInTheDocument()
    
    // Check that the value is visually prominent (size="6" makes it larger)
    expect(valueElement.closest('[class*="rt-Text"]')).toBeInTheDocument()
  })

  it('displays multiple metrics correctly', () => {
    const metrics: DashboardMetric[] = [
      {
        id: '1',
        title: 'Total Users',
        value: 1234,
        change: { type: 'increase', value: 12.5 },
      },
      {
        id: '2',
        title: 'Revenue',
        value: '$56.7K',
        change: { type: 'decrease', value: -3.2 },
      },
    ]

    render(
      <TestWrapper>
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </TestWrapper>
    )

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('+12.5%')).toBeInTheDocument()

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$56.7K')).toBeInTheDocument()
    expect(screen.getByText('-3.2%')).toBeInTheDocument()
  })
})