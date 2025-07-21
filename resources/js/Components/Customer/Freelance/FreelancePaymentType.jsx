 import { memo } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const FreelancePaymentType = ({ paymentType }) => {
  const formatPaymentType = (type) => {
    const types = {
      fixed: 'Fixed',
      hourly: 'Hourly',
      retainer: 'Retainer',
      milestone_based: 'Milestone-based',
      commission_based: 'Commission-based',
      equity_based: 'Equity-based',
      revenue_share: 'Revenue Share',
      time_and_materials: 'Time and Materials',
    };
    return types[type] || 'Unknown';
  };

  const paymentDescriptions = {
    fixed: 'One-time payment',
    hourly: 'Payment based on hours worked',
    retainer: 'Ongoing monthly payment',
    milestone_based: 'Payment by milestones',
    commission_based: 'Incentive-driven',
    equity_based: 'Stake in the project',
    revenue_share: 'Payment tied to project earnings',
    time_and_materials: 'Pay for time & resources used',
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          {paymentDescriptions[paymentType] || 'Unknown payment type'}
        </Tooltip>
      }
    >
      <span  >{formatPaymentType(paymentType)}</span>
    </OverlayTrigger>
  );
};

export default memo(FreelancePaymentType);
