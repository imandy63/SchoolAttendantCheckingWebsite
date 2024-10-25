import { Participation_Status } from "../enum/role.enum";

export interface StudentParticipatedActivity {
  name: String;
  status: Participation_Status;
  point: Number;
}
