import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const { userId } = req;
    const { id } = req.params;

    const user = await User.findByPk(userId);
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [User],
    });

    if (meetup.user_id === user.id) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      meetup_id: meetup.id,
      user_id: user.id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
