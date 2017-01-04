ALTER TABLE  `users` ADD  `msg_read` INT( 10 ) NOT NULL ;
ALTER TABLE  `users` ADD  `location` VARCHAR( 200 ) NOT NULL ;
ALTER TABLE  `users` ADD  `skills` LONGTEXT NOT NULL ;
ALTER TABLE  `users` ADD  `projects` VARCHAR( 200 ) NOT NULL ;
ALTER TABLE  `users` ADD  `associate_with_infobeans` VARCHAR( 200 ) NOT NULL ;
ALTER TABLE  `users` ADD  `interests` VARCHAR( 200 ) NOT NULL ;
ALTER TABLE  `users` ADD  `primary_project` VARCHAR( 200 ) NOT NULL ; 

CREATE TABLE IF NOT EXISTS `interests` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `interest` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;


INSERT INTO `interests` (`id`, `interest`) VALUES
(1, 'Reading'),
(2, 'Writing'),
(3, 'Coding'),
(4, 'Social Networking'),
(5, 'Travelling'),
(6, 'Dancing'),
(7, 'Singing'),
(8, 'Painting'),
(9, 'Gaming'),
(10, 'Acting');


CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

INSERT INTO `projects` (`id`, `name`) VALUES
(1, 'cdpACCESS'),
(2, 'cdpACCESS – VA'),
(3, 'Coupon Database'),
(4, 'Errata'),
(5, 'ES Report Tagging'),
(6, 'ICCSafe'),
(7, 'ICC Voting Registration'),
(8, 'Magento Storefront'),
(9, 'premiumACCESS – Phase 1'),
(10, 'premiumACCESS – Phase 2'),
(11, 'premiumACCESS – Phase 3'),
(12, 'T:Rex'),
(13, 'Parakh');

CREATE TABLE IF NOT EXISTS `designations` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `designation` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

INSERT INTO `designations` (`id`, `designation`) VALUES
(1, 'Associate Project Manager'),
(2, 'Associate QA Engineer'),
(3, 'Business Analyst'),
(4, 'Director'),
(5, 'Group Head'),
(6, 'HR Manager'),
(7, 'Module Lead'),
(8, 'Practice Head – Big Data &amp; CMS'),
(9, 'Program Manager'),
(10, 'Project Lead'),
(11, 'QA Engineer'),
(12, 'Sr. Software Engineer'),
(13, 'Software Engineer'),
(14, 'Sr. UI Developer'),
(15, 'Sr. Software Developer'),
(16, 'Trainee Software Engineer'),
(17, 'Technical Lead'),
(18, 'Technical Writer'),
(19, 'UI Developer');

DROP TABLE IF EXISTS `email_templates`;
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 ;

INSERT INTO `email_templates` (`id`, `code`, `subject`, `content`) VALUES
(1, 'PRKE01', 'Parakh - You have been rated', 'Dear {Username},\nYou have received a {rating} rating.\nLogin to {parakh} to view details.\n\nThanks,\nParakh Team'),
(2, 'PRKE02', 'Parakh - You have been rated', 'Dear {Username},\nYou have received a -1 rating.\nLogin to Parakh to view details.\n\nThanks,\nParakh Team'),
(3, 'PRKE03', 'Parakh - Your request has been approved!', 'Dear {Username},\nYour request has been approved.<br/><br/>\n\nLogin to {Parakh} to view details.<br/><br/>\n\n\nThanks,<br/>\nParakh Team<br/>'),
(4, 'PRKE04', 'Parakh - Your request has been declined!', 'Dear {Username}, \nYour request has been declined.\nLogin to {Parakh} to view details.\n\nThanks, \nParakh Team'),
(5, 'PRKE21', 'Parakh - New Rating Alert', '{member} has received a {rating} rating by {lead} for "{comment}".'),
(6, 'PRKE22', 'Parakh - Feedback Notification', '{Member} has received a feedback from {Lead}.\n"{Feedback}".\n\nThanks,\nParakh Team '),
(7, 'PRKE05', 'Parakh - Response Received', 'Dear {Username},\nYou have received a response from {Member} on feedback: {Comment} .\nLogin to {Parakh} to view details.\n\nThanks,\nParakh Team '),
(8, 'PRKE13', 'Parakh - Rating Request Received\r\n', 'Dear {Username},\nYou have received a rating request.\nLogin to {Parakh} to approve/decline request.\n\nThanks,\nParakh Team\n');

ALTER TABLE `users` ADD `img_cache` LONGTEXT NOT NULL ;




UPDATE `parakh-local`.`email_templates` SET `content`='<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n<title></title>\n	<style>\n		.im{\n		color:#fff !important;\n		}\n	</style>\n<!-- GOOGLE FONTS -->\n<link href=\"https://fonts.googleapis.com/css?family=Allura\" rel=\"stylesheet\"> \n	\n	</head>\n	\n<body bgcolor=\"#f3f3f3\">\n<table id=\"wrappertable\" style=\"table-layout: fixed;\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td valign=\"top\" align=\"center\">\n<table style=\"background: #3b404d;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"600\" valign=\"top\" align=\"center\">\n<table style=\"background: #689F39;\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"background-image: url(http://www.infobeans.com/wp-content/uploads/bgimg01.jpg);background-repeat: no-repeat; background-position: 50% 0;\" valign=\"middle\" background=\"http://www.infobeans.com/wp-content/uploads/bgimg01.jpg\" align=\"center\" height=\"100\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 0 20px;\" valign=\"top\" align=\"center\" height=\"100\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"440\" valign=\"top\" align=\"center\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"line-height: 0px !important; font-size: 1px; line-height: 1px;\" width=\"370\" valign=\"top\" align=\"center\">\n<a style=\"text-decoration: none; display: block; height:80px;\" href=\"http://qa.parakhnewdesign.com/\" target=\"_blank\"><img src=\"http://www.infobeans.com/wp-content/uploads/login-logo.png\" alt=\"\" style=\"max-width: 100%; width: 226px;\" width=\"100%\"></a>\n</td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 22px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 20px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"background-image: url(http://www.infobeans.com/wp-content/uploads/bgimg08.jpg);background-repeat: no-repeat; background-size: cover;\" valign=\"middle\" background=\"http://www.infobeans.com/wp-content/uploads/bgimg08.jpg\" align=\"center\" height=\"550\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 0 20px;\" valign=\"top\" align=\"center\" height=\"400\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 20px;\" valign=\"top\" align=\"center\" height=\"400\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"440\" valign=\"top\" align=\"left\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n</table>\n<table style=\"padding-top: 12px;\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"color: #ffffff; font-family: Allura; font-size: 40px; mso-line-height-rule: exactly; line-height: 22px; font-weight: 100; text-transform: capitalize; letter-spacing: 1.44px;\" class=\"section-heading\" valign=\"top\" align=\"left\">Dear {Username}</td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 20px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 0px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 22px; line-height: 0px;\"></td>\n</tr>\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n<tbody><tr>\n<td style=\"font-family: Geneva, sans-serif; font-size: 18px; line-height: 22px; font-weight: 400; top: 50%; z-index: 0;  color: rgb(255, 255, 255);\" width=\"350\" valign=\"top\" align=\"left\"><span style=\"color:#fff;\">{Member} has received a feedback from {Manager}.</span>\n</td>\n</tr>\n</tbody></table>\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n<tbody><tr>\n<td style=\"font-family: Geneva, sans-serif; font-size: 18px; line-height: 32px; font-weight: 400; top: 50%; z-index: 0;  color: rgb(255, 255, 255);\" width=\"350\" valign=\"top\" align=\"left\"><span style=\"color:#fff;\">\"{Feedback}\".</span>\n</td>\n</tr>\n</tbody></table>\n<table style= width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"color: #ffffff; font-family: Geneva, sans-serif; font-size: 18px; mso-line-height-rule: exactly; padding-top: 20px; line-height: 32px; font-weight: 400;\" valign=\"top\" align=\"left\">Thanks,<br> Parakh Team.</td>\n</tr>\n</tbody></table>\n<table style=\"margin-top: 35px; margin-bottom: 25px;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n<tbody><tr>\n<td style=\"padding-top: 1px; line-height: 0px;\" width=\"160\" valign=\"top\" align=\"center\"></td>\n</tr>\n	</tbody></table>\n\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n<table style=\"background: #689F39\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"background-image: url(http://www.infobeans.com/wp-content/uploads/bgimg01.jpg);background-repeat: no-repeat; background-position: 50% 0;\" valign=\"middle\" background=\"http://www.infobeans.com/wp-content/uploads/bgimg01.jpg\" align=\"center\" height=\"60\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 0 20px;\" valign=\"top\" align=\"center\" height=\"60\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"440\" valign=\"top\" align=\"center\">\n\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 15px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n\n\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"color: rgb(255, 255, 255); font-family: Tahoma,Geneva,sans-serif; line-height: 35px; font-weight: 400; font-size: 14px; padding-left: 30px;\" width=\"360\" valign=\"top\" align=\"left\">&copy; Copyright 2016 InfoBeans, All Rights Reserved. </td>\n</tr>\n</tbody></table>\n\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</tbody></table>\n</body>\n	</html>' WHERE `id`='11';






UPDATE `parakh-local`.`email_templates` SET `content`='<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n<title></title>\n	<style>\n		.im{\n		color:#fff !important;\n		}\n	</style>\n<!-- GOOGLE FONTS -->\n<link href=\"https://fonts.googleapis.com/css?family=Allura\" rel=\"stylesheet\"> \n	\n	</head>\n	\n<body bgcolor=\"#f3f3f3\">\n<table id=\"wrappertable\" style=\"table-layout: fixed;\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td valign=\"top\" align=\"center\">\n<table style=\"background: #3b404d;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"600\" valign=\"top\" align=\"center\">\n<table style=\"background: #689F39;\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"background-image: url(http://www.infobeans.com/wp-content/uploads/bgimg01.jpg);background-repeat: no-repeat; background-position: 50% 0;\" valign=\"middle\" background=\"http://www.infobeans.com/wp-content/uploads/bgimg01.jpg\" align=\"center\" height=\"100\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 0 20px;\" valign=\"top\" align=\"center\" height=\"100\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"440\" valign=\"top\" align=\"center\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"line-height: 0px !important; font-size: 1px; line-height: 1px;\" width=\"370\" valign=\"top\" align=\"center\">\n<a style=\"text-decoration: none; display: block; height:80px;\" href=\"http://qa.parakhnewdesign.com/\" target=\"_blank\"><img src=\"http://www.infobeans.com/wp-content/uploads/login-logo.png\" alt=\"\" style=\"max-width: 100%; width: 226px;\" width=\"100%\"></a>\n</td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 22px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 20px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"background-image: url(http://www.infobeans.com/wp-content/uploads/bgimg08.jpg);background-repeat: no-repeat; background-size: cover;\" valign=\"middle\" background=\"http://www.infobeans.com/wp-content/uploads/bgimg08.jpg\" align=\"center\" height=\"550\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 0 20px;\" valign=\"top\" align=\"center\" height=\"400\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 20px;\" valign=\"top\" align=\"center\" height=\"400\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"440\" valign=\"top\" align=\"left\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n</table>\n<table style=\"padding-top: 12px;\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"color: #ffffff; font-family: Allura; font-size: 35px; mso-line-height-rule: exactly; line-height: 22px; font-weight: 100; text-transform: capitalize; letter-spacing: 1.44px;\" class=\"section-heading\" valign=\"top\" align=\"left\">Dear {Username}</td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 20px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 0px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 22px; line-height: 0px;\"></td>\n</tr>\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n<tbody><tr>\n<td style=\"font-family: Geneva, sans-serif; font-size: 18px; line-height: 22px; font-weight: 400; top: 50%; z-index: 0;  color: rgb(255, 255, 255);\" width=\"350\" valign=\"top\" align=\"left\"><span style=\"color:#fff;\">{Member} has received a feedback from {Manager}.</span>\n</td>\n</tr>\n</tbody></table>\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n<tbody><tr>\n<td style=\"font-family: Geneva, sans-serif; font-size: 18px; line-height: 32px; font-weight: 400; top: 50%; z-index: 0;  color: rgb(255, 255, 255);\" width=\"350\" valign=\"top\" align=\"left\"><span style=\"color:#fff;\">\"{Feedback}\".</span>\n</td>\n</tr>\n</tbody></table>\n<table style= width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"color: #ffffff; font-family: Geneva, sans-serif; font-size: 18px; mso-line-height-rule: exactly; padding-top: 20px; line-height: 32px; font-weight: 400;\" valign=\"top\" align=\"left\">Thanks,<br> Parakh Team.</td>\n</tr>\n</tbody></table>\n<table style=\"margin-top: 35px; margin-bottom: 25px;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\n<tbody><tr>\n<td style=\"padding-top: 1px; line-height: 0px;\" width=\"160\" valign=\"top\" align=\"center\"></td>\n</tr>\n	</tbody></table>\n\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n<table style=\"background: #689F39\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"background-image: url(http://www.infobeans.com/wp-content/uploads/bgimg01.jpg);background-repeat: no-repeat; background-position: 50% 0;\" valign=\"middle\" background=\"http://www.infobeans.com/wp-content/uploads/bgimg01.jpg\" align=\"center\" height=\"60\">\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding: 0 20px;\" valign=\"top\" align=\"center\" height=\"60\">\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td width=\"440\" valign=\"top\" align=\"center\">\n\n<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"padding-top: 15px; line-height: 0px;\"></td>\n</tr>\n</tbody></table>\n\n\n<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n<tbody><tr>\n<td style=\"color: rgb(255, 255, 255); font-family: Tahoma,Geneva,sans-serif; line-height: 35px; font-weight: 400; font-size: 14px; padding-left: 30px;\" width=\"360\" valign=\"top\" align=\"left\">&copy; Copyright 2016 InfoBeans, All Rights Reserved. </td>\n</tr>\n</tbody></table>\n\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</td>\n</tr>\n</tbody></table>\n</tbody></table>\n</body>\n	</html>\n\n\n\n' WHERE `id`='10';

ALTER TABLE  `users` ADD COLUMN `firstLogin` INT NOT NULL DEFAULT 0 AFTER `img_cache`;
