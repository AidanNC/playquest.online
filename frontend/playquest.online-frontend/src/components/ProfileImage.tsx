import styled from "styled-components";
import { MobileWidth } from "../MediaQueryConstants";

import beanbag from "../assets/img/profile_pictures/beanbag.jpg";
import chef from "../assets/img/profile_pictures/chef.jpg";
import dainty from "../assets/img/profile_pictures/dainty.jpg";
import derp from "../assets/img/profile_pictures/derp.jpg";
import frazzled from "../assets/img/profile_pictures/frazzled.jpg";
import happycar from "../assets/img/profile_pictures/happycar.jpg";
import holy from "../assets/img/profile_pictures/holy.jpg";
import homies from "../assets/img/profile_pictures/homies.jpg";
import hrmm from "../assets/img/profile_pictures/hrmm.jpg";
import introspective from "../assets/img/profile_pictures/introspective.jpg";
import licker from "../assets/img/profile_pictures/licker.jpg";
import richdoge from "../assets/img/profile_pictures/richdoge.jpg";
import shroom from "../assets/img/profile_pictures/shroom.jpg";
import sideways from "../assets/img/profile_pictures/sideways.jpg";
import snooze from "../assets/img/profile_pictures/snooze.jpg";
import stone from "../assets/img/profile_pictures/stone.jpg";
import swag from "../assets/img/profile_pictures/swag.jpg";
import tentacle from "../assets/img/profile_pictures/tentacle.jpg";
import wise from "../assets/img/profile_pictures/wise.jpg";
import yawn from "../assets/img/profile_pictures/yawn.jpg";
import awoo from "../assets/img/profile_pictures/awoo.jpg";
import boog from "../assets/img/profile_pictures/boog.jpg";
import boring from "../assets/img/profile_pictures/boring.jpg";
import brain from "../assets/img/profile_pictures/brain.jpg";
import dorp from "../assets/img/profile_pictures/dorp.jpg";
import fierce from "../assets/img/profile_pictures/fierce.jpg";
import gnome from "../assets/img/profile_pictures/gnome.jpg";
import grama from "../assets/img/profile_pictures/grama.jpg";
import hat from "../assets/img/profile_pictures/hat.jpg";
import longsnout from "../assets/img/profile_pictures/longsnout.jpg";
import nails from "../assets/img/profile_pictures/nails.jpg";
import sleepylick from "../assets/img/profile_pictures/sleepylick.jpg";
import slickedback from "../assets/img/profile_pictures/slickedback.jpg";
import snooter from "../assets/img/profile_pictures/snooter.jpg";
import teeth from "../assets/img/profile_pictures/teeth.jpg";
import tunnel from "../assets/img/profile_pictures/tunnel.jpg";
import yawn2 from "../assets/img/profile_pictures/yawn2.jpg";
import yummy from "../assets/img/profile_pictures/yummy.jpg";

const images = [
	beanbag,
	chef,
	dainty,
	derp,
	frazzled,
	happycar,
	holy,
	homies,
	hrmm,
	introspective,
	licker,
	richdoge,
	shroom,
	sideways,
	snooze,
	stone,
	swag,
	tentacle,
	wise,
	yawn,
	awoo,
	boog,
	boring,
	brain,
	dorp,
	fierce,
	gnome,
	grama,
	hat,
	longsnout,
	nails,
	sleepylick,
	slickedback,
	snooter,
	teeth,
	tunnel,
	yawn2,
	yummy,
];
export const imageNames = [
	"beanbag",
	"chef",
	"dainty",
	"derp",
	"frazzled",
	"happycar",
	"holy",
	"homies",
	"hrmm",
	"introspective",
	"licker",
	"richdoge",
	"shroom",
	"sideways",
	"snooze",
	"stone",
	"swag",
	"tentacle",
	"wise",
	"yawn",
	"awoo",
	"boog",
	"boring",
	"brain",
	"dorp",
	"fierce",
	"gnome",
	"grama",
	"hat",
	"longsnout",
	"nails",
	"sleepylick",
	"slickedback",
	"snooter",
	"teeth",
	"tunnel",
	"yawn2",
	"yummy",
];

const ProfileIcon = styled.div`
	height: 120px;
	width: 120px;
	display: flex;
	justify-content: center;
	align-items: center;
	// background-color: #cbc0fc;

	@media (max-width: ${MobileWidth}) {
		height: 100px;
		width: 100px;
		margin-left: -5px;
	}
`;

const Icon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	border-radius: 16px;
	img {
		border-radius: 16px;
		max-height: 120px;
		max-width: 120px;
		border: 2px solid #15001c;
	}
	&.selected {
		border: 3px solid var(--main-pink);
	}
	@media (max-width: ${MobileWidth}) {
		img {
			max-height: 100%;
			max-width: 100%;
		}
		height: 100px;
		width: 100px;
	}
`;

type Props = {
	imageString: string;
	selected: boolean;
};

export default function ProfileImage({ imageString, selected }: Props) {
	const index = imageNames.indexOf(imageString);

	return (
		<ProfileIcon>
			<Icon className={selected ? "selected" : ""}>
				<img src={images[index !== -1 ? index : 0]} alt="profile" />
			</Icon>
		</ProfileIcon>
	);
}
