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

