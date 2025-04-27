import axios from 'axios';
import cheerio from 'cheerio';
import { config } from 'dotenv';
config();

export async function query711(trackingNo) {
  const url = process.env.SEVEN_ELEVEN_TRACKING_ENDPOINT + trackingNo;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const steps = [];
  $('#result tr').each((i, el) => {
    const tds = $(el).find('td');
    if (tds.length >= 2) {
      steps.push({
        time: $(tds[0]).text().trim(),
        status: $(tds[1]).text().trim()
      });
    }
  });
  return { trackingNo, steps };
}
