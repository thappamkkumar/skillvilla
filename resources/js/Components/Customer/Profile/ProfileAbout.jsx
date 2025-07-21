import { memo } from 'react';
import LargeText from '../../Common/LargeText';
const ProfileAbout = ({ about }) => {
  return (
    <div className="w-100 h-auto px-2 px-lg-5   pt-4 ">
			<div className="w-100 h-auto px-2 px-lg-5 pt-4 pb-4 rounded sub_main_container">
				<h2 className="  pb-2 border-bottom">About</h2>
				<div className="   ">
					{about ? <LargeText largeText={about} /> :  "No information provided."}
				</div>
			</div>
    </div>
  );
};

export default memo(ProfileAbout);
