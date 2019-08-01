import Meetup from '../models/Meetup';

class OrganizationController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.json(meetups);
  }
}

export default new OrganizationController();
