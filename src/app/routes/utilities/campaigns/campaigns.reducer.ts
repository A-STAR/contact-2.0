import { ICampaignsState } from './campaigns.interface';
import { SafeAction, UnsafeAction } from '../../../core/state/state.interface';

import { CampaignsService } from './campaigns.service';

export const defaultState: ICampaignsState = {
  selectedCampaign: null,
  selectedParticipant: null
};

export function reducer(state: ICampaignsState = defaultState, action: UnsafeAction): ICampaignsState {
  switch (action.type) {
    case CampaignsService.CAMPAIGN_SELECT:
      return {
        ...state,
        selectedCampaign: action.payload.selectedCampaign
      };
    case CampaignsService.PARTICIPANT_SELECT:
      return {
        ...state,
        selectedParticipant: action.payload.selectedParticipant
      };
    default:
      return state;
  }
}
