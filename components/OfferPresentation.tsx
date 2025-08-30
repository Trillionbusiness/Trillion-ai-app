import React from 'react';
import { GeneratedPlaybook } from '../../types';
import Card from './common/Card';

interface OfferPresentationProps {
  playbook: GeneratedPlaybook;
}

const OfferPresentation: React.FC<OfferPresentationProps> = ({ playbook }) => {
  // This component can be built out later to display the presentation.
  // For now, it's a placeholder.
  return (
    <Card>
      <h2 className="text-2xl font-bold text-white">Offer Presentation</h2>
      <p className="text-gray-400 mt-2">
        This is a placeholder for the offer presentation based on "{playbook.offer1.name}".
      </p>
    </Card>
  );
};

export default OfferPresentation;
