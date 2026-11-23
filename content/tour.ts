import type { IconName } from '@/components/ui/Icon'

/* ============================================================================
 * The product tour: demo flows that play themselves.
 *
 * GENERATED from the live product by a capture script. For every step the
 * script opened the real screen, measured where the element to click sits
 * (x / y / w / h as a percentage of a 1440×900 screen), then clicked it for
 * real to reach the next screen. Clicks that would save data (punch in,
 * submit) were only pointed at, never pressed: those steps are 'hover'.
 *
 * Screens come from the product's demo company. Every person, company and
 * figure in them is fictional. Edit the words freely; if a screen changes,
 * re-capture it rather than nudging a target by eye.
 * ========================================================================= */

export type DemoPersona = 'Employee' | 'Manager' | 'HR team'

/** Centre and size of the element the cursor goes to, in % of the screen. */
export type DemoTarget = { x: number; y: number; w: number; h: number }

export type DemoStep = {
  src: string
  srcSm: string
  /** A ~30px blurred copy, shown until the real screen has decoded. */
  lqip: string
  title: string
  body: string
  /** click = the cursor presses it and the next screen follows; hover = it only points. */
  act: 'click' | 'hover' | 'none'
  target: DemoTarget | null
}

export type DemoFlow = {
  id: string
  name: string
  persona: DemoPersona
  icon: IconName
  blurb: string
  /** What the address bar shows. */
  host: string
  steps: DemoStep[]
}

export type PhoneScreen = {
  id: string
  title: string
  caption: string
  src: string
  /** The app's tab bar, laid over the bottom of the phone. */
  nav: string
  /** height / width of the tall screen and of the tab bar. */
  ratio: number
  navRatio: number
  lqip: string
}

export const demoFlows: DemoFlow[] = [
  {
    "id": "ess-day",
    "name": "An employee’s day",
    "persona": "Employee",
    "icon": "smartphone",
    "blurb": "Punch in, check the month, apply for leave and claim travel, without a single email to HR.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/ess-day-0.webp",
        "srcSm": "/tour/ess-day-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASogABQAPt1WpU2opKOiN/qoARAbiWMAyFwj/9tvx52j5/7nt4AA/t8prxcHMnIZBU+Y8gvxs5bpSH4oxo0X23U2WS3bhDH7ZcmpRCJHXOBpaaTG3o8M2BYEagehF7yXwoqjswgAAAA=",
        "title": "Punch in from the first screen",
        "body": "Shift timing, the week, leave balance and the next holiday, before anything is clicked.",
        "act": "hover",
        "target": {
          "x": 83.53,
          "y": 37.64,
          "w": 4.87,
          "h": 1.72
        }
      },
      {
        "src": "/tour/ess-day-0.webp",
        "srcSm": "/tour/ess-day-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASogABQAPt1WpU2opKOiN/qoARAbiWMAyFwj/9tvx52j5/7nt4AA/t8prxcHMnIZBU+Y8gvxs5bpSH4oxo0X23U2WS3bhDH7ZcmpRCJHXOBpaaTG3o8M2BYEagehF7yXwoqjswgAAAA=",
        "title": "Attendance, one tap away",
        "body": "Everything an employee needs sits in one menu: time, pay, team and community.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 23.15,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/ess-day-2.webp",
        "srcSm": "/tour/ess-day-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAwBACdASogABQAPuFgp02opaOiMAwBEBwJZwDG9CHEg/dwdJG6ingbwIAA/u2dA/Mzfs6HMJubM/TrsoHThgr+DIWzX6yxsKjFXV29XtsqHEVqFvWUDlqVPwh9MZImFQ8tTvkJyJtM1CSmgmOcsZ1+mnsAAA==",
        "title": "The month, colour-coded",
        "body": "Present, late, half-day and loss of pay counted as the month goes, with regularisation on the same screen.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 27.48,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/ess-day-3.webp",
        "srcSm": "/tour/ess-day-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACwAwCdASogABQAPu1ur1IppiQiqAgBMB2JZwDI1A8/ZnsuQy/cAAD+7Z7SIAAckcjqdPyrMlyBSzKgCHSfWdyP1yRw8Ib5L74G507nnhDf0A7K/LEAAAAA",
        "title": "Leave balance up front",
        "body": "Every leave type with what is left, and the form right next to it.",
        "act": "click",
        "target": {
          "x": 33.61,
          "y": 35.84,
          "w": 1.79,
          "h": 2.11
        }
      },
      {
        "src": "/tour/ess-day-4.webp",
        "srcSm": "/tour/ess-day-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACQAwCdASogABQAPu1wsFKppiSiqAgBMB2JZwDKABEa1a3kSjgAAP7tmbB9L/UgdCAAyNPdlaaF9zADVO3OXGIKuIRay8zJe8qF/3Zpk1QE/AAA",
        "title": "Pick the type",
        "body": "Casual, earned, sick, comp-off, maternity and more, each with its own rules.",
        "act": "click",
        "target": {
          "x": 49.88,
          "y": 97.7,
          "w": 5.02,
          "h": 4.67
        }
      },
      {
        "src": "/tour/ess-day-5.webp",
        "srcSm": "/tour/ess-day-5-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADQBACdASogABQAPuFgpU2opiOiN/VYARAcCWUAvzgPY4nibBv3E3tR79SQV2aaAAD+7Z7V+tMCZFUT3TRJVbHSH1t4fQBDiuSCoZP85VSOOhq/M84fAzABhT1eunOwgHFiGZ/vD4fUYAAA",
        "title": "Pick the dates",
        "body": "Holidays and weekends are already marked, so the day count is right before it is sent.",
        "act": "click",
        "target": {
          "x": 9.41,
          "y": 36.15,
          "w": 10.76,
          "h": 2.25
        }
      },
      {
        "src": "/tour/ess-day-6.webp",
        "srcSm": "/tour/ess-day-6-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAADQAwCdASogABQAPu1iqU2ppaQiMAgBMB2JYwC06B6SDlRwMGpFeJwA/t8pqx2JcgFiZXDHVAHdX5o7w1euae8qm2oEIYR5FUd6i4lUN9vBJZsccizPTc4agVM7sIpP+lWSlFcEMAA=",
        "title": "Claims, four ways",
        "body": "A local trip, a domestic or international trip, or a bill with no trip. Each routes to the manager, then Finance.",
        "act": "hover",
        "target": {
          "x": 47,
          "y": 34.75,
          "w": 17.12,
          "h": 3
        }
      }
    ]
  },
  {
    "id": "manager",
    "name": "A manager’s Monday",
    "persona": "Manager",
    "icon": "users",
    "blurb": "A Monday note on the team, approvals in one inbox, and reviews owed in order of deadline.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/manager-0.webp",
        "srcSm": "/tour/manager-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAAAQBQCdASogABQAPt1apU2opSOiN/qoARAbiWMAuKgj/+PZ3jirYIP+0k13bebwGx8AAP7fKa8XRukLfXZKNvv4zjsSNw/egMdQrsFFpUZTdUf6SkKJw/Rdo4Z2BXFfhbxs4FUc9VxBEeegHaQlwKZgbDIlp864AAA=",
        "title": "Approvals come to them",
        "body": "A regularisation request sits on the manager’s home screen with an Approve button. No email chain.",
        "act": "hover",
        "target": {
          "x": 59.25,
          "y": 97.75,
          "w": 5.22,
          "h": 3.33
        }
      },
      {
        "src": "/tour/manager-0.webp",
        "srcSm": "/tour/manager-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAAAQBQCdASogABQAPt1apU2opSOiN/qoARAbiWMAuKgj/+PZ3jirYIP+0k13bebwGx8AAP7fKa8XRukLfXZKNvv4zjsSNw/egMdQrsFFpUZTdUf6SkKJw/Rdo4Z2BXFfhbxs4FUc9VxBEeegHaQlwKZgbDIlp864AAA=",
        "title": "The team, before the coffee",
        "body": "Who is in today, who is late, and what is waiting on them, on one screen.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 48.57,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/manager-2.webp",
        "srcSm": "/tour/manager-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwAwCdASogABQAPu1wsFKppiSiqAgBMB2JZ2llWB2J0BVAAP7wNHMzPU8JmDmDn5x4HaZL4DMCjIXlHXnPNvaoIMxf2APU9eGSJ2Q5Z+lD8xgWGAA=",
        "title": "Their own month, in numbers",
        "body": "Attendance, punctuality and streaks for the manager themselves, compared with the team.",
        "act": "click",
        "target": {
          "x": 95.02,
          "y": 25.42,
          "w": 5.66,
          "h": 3.72
        }
      },
      {
        "src": "/tour/manager-3.webp",
        "srcSm": "/tour/manager-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADQAwCdASogABQAPu1usFIppiSiqAgBMB2JZ2lCWukJsCQkE4XBsAAA/vA0dA9ErSaybvgnxQLrYJMsiiZoYS1XI97BuALJqwVShGAf+CBig7FKNTKNxHwqqAQAAA==",
        "title": "The Monday note",
        "body": "AI-written from the team’s own figures: a health score, who is out, and the one thing to start with.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 52.9,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/manager-4.webp",
        "srcSm": "/tour/manager-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAwCdASogABQAPu1wsVKppiSjqAgBMB2JZwDHMA9qhbSfd+HOtAAA/u2e0h+w26giQpTkugBPyx9SBKIAr/ypCnGUWJizcf2uOMkItTZ5Z5AAAAA=",
        "title": "Where they sit",
        "body": "The reporting line above, peers alongside, and direct reports below, with status at a glance.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 61.57,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/manager-5.webp",
        "srcSm": "/tour/manager-5-sm.webp",
        "lqip": "data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAABwBQCdASogABQAPulmqk2pJiQiMBgMASAdCWoAsQzaCf4BuGHGVaV1ig/G1mORsKkYuA4AAP7tntImXLVip3oKzzzJQUtNQe798HiB7xi5vTS8d9DiQaR52a9sa44Q7drvB8iL13VryLqo6IAX4yTsTtmUXReTZpoAGgTzhDiyaIT+3l6dsu5oVi7HmB0uZoC8CM1h8l22NM32AJHsLlR4rUTGyyMUjAwoEGOlDVrC0YyROo4u65WpmAAAAA==",
        "title": "Reviews, in one place",
        "body": "Their own review on one side, the team they rate on the other.",
        "act": "click",
        "target": {
          "x": 77.82,
          "y": 26.57,
          "w": 26.05,
          "h": 2.27
        }
      },
      {
        "src": "/tour/manager-6.webp",
        "srcSm": "/tour/manager-6-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAADQAwCdASogABQAPu1osFAppaUiqAqpMB2JYwC/7BEdC2WxwHc8TgAA/u2XlnvuLVJm9HajWNMG5gSLqHA1KHcAuaHr9oSHJCAazIVoU/YeL45Io2MqbcIFtbj8rbdoZ67G8iG/l0mS11GRPL7NqKAA",
        "title": "Reviews owed, in order",
        "body": "Approve KRAs, log one-to-ones, rate the team and raise a PIP, ordered by whose deadline cannot move.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "pms-ess",
    "name": "My review",
    "persona": "Employee",
    "icon": "target",
    "blurb": "Seven stages with dates, what is owed next, and the result when it lands.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/pms-ess-0.webp",
        "srcSm": "/tour/pms-ess-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAABQBQCdASogABQAPulkqk2pJaQiMBgMASAdCWoAsQziSf4BuGHGVaV1omR5AGduv/fvjUAA/u2e0iZctWKnegrPPMlBS01B7v3weIHvGLm9NLx30OJCoahDe74k9H9k1+GCl+CH9oNlsu9/QwBPa3dGkrOpbpt3/3PePlYn5jv5a11+uDH/eSJ5/MpTa4wzRP7tzn0y3HaK7SBnI8EcLbfT3QxoQUtYXTGfAcPZBXgP1X25OpGNMjy30AA=",
        "title": "Seven stages, with dates",
        "body": "KRA setting, one-to-one, weightage lock, self rating, manager review, HOD finalise and result.",
        "act": "hover",
        "target": {
          "x": 44.24,
          "y": 78.51,
          "w": 39.18,
          "h": 2.4
        }
      },
      {
        "src": "/tour/pms-ess-0.webp",
        "srcSm": "/tour/pms-ess-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAABQBQCdASogABQAPulkqk2pJaQiMBgMASAdCWoAsQziSf4BuGHGVaV1omR5AGduv/fvjUAA/u2e0iZctWKnegrPPMlBS01B7v3weIHvGLm9NLx30OJCoahDe74k9H9k1+GCl+CH9oNlsu9/QwBPa3dGkrOpbpt3/3PePlYn5jv5a11+uDH/eSJ5/MpTa4wzRP7tzn0y3HaK7SBnI8EcLbfT3QxoQUtYXTGfAcPZBXgP1X25OpGNMjy30AA=",
        "title": "The next thing owed",
        "body": "Overdue items rise to the top with the deadline, so nobody finds out at finalisation.",
        "act": "click",
        "target": {
          "x": 34.4,
          "y": 55.14,
          "w": 7.32,
          "h": 5.56
        }
      },
      {
        "src": "/tour/pms-ess-2.webp",
        "srcSm": "/tour/pms-ess-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABwBACdASogABQAPuFeqU2opSQiMAwBEBwJQBkag9I9SPwvFj0Tn32W6lMB4AD+7Z7GnUNfxuxw5ZYlWF3qUZH2P6IUueL/C0RSAxcC360td/8l6hx5BnKy3v5U73/m+o/8PxoRfyTn7qWcsfGQHAZa0JgPeV65gAAAAA==",
        "title": "KRAs that add up",
        "body": "Four to ten goals, weightage exactly 100, approved by the manager and then locked.",
        "act": "click",
        "target": {
          "x": 43.73,
          "y": 55.14,
          "w": 10.79,
          "h": 5.56
        }
      },
      {
        "src": "/tour/pms-ess-3.webp",
        "srcSm": "/tour/pms-ess-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADQAwCdASogABQAPu1mqk2ppaQiMAgBMB2JQBjmA9Idlzeiqc4HY4AA/u2et3tOe3/KBgeq+5GpS0R9mLZ8+nkwMdvkag0Gd2wYxVLE/8hQ2vYhNsR96re7xFQuszD+kp6XGjIys4quSd+3LyLrQNxSAAA=",
        "title": "One-to-ones, on record",
        "body": "Both sides confirm the conversation happened. No more reviews written from memory.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "pms",
    "name": "Performance reviews",
    "persona": "HR team",
    "icon": "target",
    "blurb": "A seven-stage cycle HR can actually run: policy, tracking, ratings, calibration and PIPs.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/pms-0.webp",
        "srcSm": "/tour/pms-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAAAQBQCdASogABQAPu1gqE4ppSOiMBgMATAdiWIAvzgRZPvZm67RfPczA15IL4IFoQ7YAP7T5QKJGIx01cqWSdKgDxMCRY3oND+F6o+bSvOzd+sVnGXJf9h4MEHYY6fu2QpZo5+cIgk6xNtj+f/rdZU0Qs466o4os6HD0OJiWLc0FlDMeh8YLcOSKFuCfwm91qfMseckEEXAuoyajzwAAA==",
        "title": "Where the cycle stands",
        "body": "One sentence on what is blocking the cycle, and everyone in it by stage, in the order the work happens.",
        "act": "click",
        "target": {
          "x": 61.55,
          "y": 33.23,
          "w": 9.09,
          "h": 4
        }
      },
      {
        "src": "/tour/pms-1.webp",
        "srcSm": "/tour/pms-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAwBACdASogABQAPulep02pJSOiN/VYASAdCUAYmwHpHqDSNt05Ld0ltQAA/tPlAomvzHsaRs0IOf1xwgmsLKeayj4jIm8N5BtfsdxJkPoFUumC8s0Xm2ZBzYMsfY2Hk4cdhUiNLh5Gq6lFIFYNdy3UGY23TLJjSZTflPq92eyKvimdB+PQnHzI6d2F3PDba1gAAA==",
        "title": "Policy, as configuration",
        "body": "Frequency, stages, rating scale, weightage rules and who approves. Built, not coded.",
        "act": "click",
        "target": {
          "x": 75.32,
          "y": 33.23,
          "w": 10.94,
          "h": 4
        }
      },
      {
        "src": "/tour/pms-2.webp",
        "srcSm": "/tour/pms-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAAAQBQCdASogABQAPuVepk2pJSOiMAwBIByJYgC7IF0lzAe4qFAaJ2YhpD5UqlTPGIvoAP7fvTeLVXncJZgmtom4N05bqi51hqL1gNCmqWRhnqfg22f9G0BAQyWK8crwaODUgMlR2zd64SxB5ZXh6KrE0Y2LaYnS170srOjwI5fpYCL2QhuaeCcHtQtQsWLrS5SCu9Da5Omx5Y3mp8OjOeu6ofM+lhAA",
        "title": "Who is stuck, and where",
        "body": "Every person and every stage, filterable by company, department and manager. Nudge in bulk.",
        "act": "click",
        "target": {
          "x": 38.45,
          "y": 37.9,
          "w": 10.81,
          "h": 4
        }
      },
      {
        "src": "/tour/pms-3.webp",
        "srcSm": "/tour/pms-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAABQBQCdASogABQAPu1wsFIppiSiqAgBMB2JbACdMwS7LbTAPcUTXTEJfFN1wAuU2WVYrUAA/tSwCiRiMdNXR400OoDxvyTf1D48upokGGcfJdFCV/Spsefhuvw7KZPVtTjDM5nxx4lmsNUL9AacZOvBk/A7YZEYe7LOePPGJAWSNUt64lzXZoBuy2H4BhBOwV21twtHUGIjVGFdpIQd7am4iZR7IsqMozGp/UXtKkc5rPEcFLx5ANcJF4YntDPqopQUUvVbx97A4ULjx/KWgmMldAAAAA==",
        "title": "Ratings against a guideline",
        "body": "The final spread against a reference curve. A guideline, not a forced quota.",
        "act": "click",
        "target": {
          "x": 68.36,
          "y": 37.9,
          "w": 10.46,
          "h": 4
        }
      },
      {
        "src": "/tour/pms-4.webp",
        "srcSm": "/tour/pms-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAABwBQCdASogABQAPu1gq02ppaQiMBgMATAdiWIAtRdrgO9iTaK+uSPPAE1D04qk/qNRoiJAAP7T5QKJGIx01cqWSdKgDxMCTf1D48upnlIYdrNdXQQ4g4N7/RtkYrisSRj55kPWSVgOkM1ALcGzIWSRUZ8IyckZHY/OVly3Vcj8U8hyvu6qPhWGElaD/6hPHOZD3CmY+aJUh9/GY2xXusqmFJTYKEAA",
        "title": "Improvement plans",
        "body": "Raised by the manager, approved by HR, tracked to a close with check-ins along the way.",
        "act": "click",
        "target": {
          "x": 39.02,
          "y": 42.57,
          "w": 10.57,
          "h": 4
        }
      },
      {
        "src": "/tour/pms-5.webp",
        "srcSm": "/tour/pms-5-sm.webp",
        "lqip": "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAADwBACdASogABQAPu1eqk2ppKQiMBgMATAdiUAX5wIsoC4OQ+eHyrjNbiQH1kanFgAA/tPlAokYjHTVypZJ0qAPEwJN/UPjy6meUhh2s11dBEGwTyEhBACoFiZLyvAnKclWCknTU8l9er6Ul1R0q5WyoRzzN+GhPkMCXjugsoId160Wh6XwsHpHOAAwtbDmv+w/Dg0RAwAAAA==",
        "title": "Who rates whom",
        "body": "RM L1, RM L2 and HOD for every employee, so no review lands with the wrong person.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "lms",
    "name": "EZER Learn",
    "persona": "Employee",
    "icon": "book",
    "blurb": "A learning app people open by choice: courses, streaks, badges and certificates.",
    "host": "ezerlms.com",
    "steps": [
      {
        "src": "/tour/lms-0.webp",
        "srcSm": "/tour/lms-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAABQBACdASogABQAPu1qq1EppaOiqAqpMB2JZQDIXA9oeMl6d4Kv13DqUuiwAP7phunmCWFQN9yqcN6Bj4C0EPkViBE1b5ibaklP0vT0ROh4soCDf8DtG+n1eG5iAfzrpZlX3/xR/3IIf7bZEst9BzfLNEVNoYybD2+hiZwVfI9MiD0petXoAAAA",
        "title": "Learning, built in",
        "body": "Opens from the HR app with no second login. Courses picked for the role and team, front and centre.",
        "act": "click",
        "target": {
          "x": 7.35,
          "y": 21.37,
          "w": 7.05,
          "h": 2.25
        }
      },
      {
        "src": "/tour/lms-1.webp",
        "srcSm": "/tour/lms-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADQBACdASogABQAPu1mqk+ppSOiMBgIATAdiWwAs68AANHiJUu+iWbBeq2HrD5SgAD+6PHLuxTii5TNboVkLljPWt6ydRCMLmgfyeXVu+9giuwMXv3Gjy0vA8yJi7P6ZDmHCIzuujy9fWE4Uj4iasF+e/5CVvxm64eaTBDXEvtbVwAA",
        "title": "A real catalogue",
        "body": "Search, filter by level, length and category, and see what colleagues are taking.",
        "act": "click",
        "target": {
          "x": 70.31,
          "y": 72.26,
          "w": 11.31,
          "h": 4.44
        }
      },
      {
        "src": "/tour/lms-2.webp",
        "srcSm": "/tour/lms-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAAAwBACdASogABQAPuFeqU2opSQiMAwBEBwJQBWAA9IMSsbSidoE3c46c7AA/uv9829D5xqNKSNKVakNA5FdcQysGYb9EXzYWOTUhObKNLVqPyk4c4YKdgUHZey6oYA0JJoJw6LLetcMn/CtV7WKY8KPFwvo/q+x3lwHh6fRGdZbMoGlrmLwIZ66gAA=",
        "title": "Every course, explained",
        "body": "Videos, readings, quizzes and a final assessment, with pass marks, attempts and a certificate.",
        "act": "click",
        "target": {
          "x": 6.97,
          "y": 30.7,
          "w": 6.3,
          "h": 2.25
        }
      },
      {
        "src": "/tour/lms-3.webp",
        "srcSm": "/tour/lms-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADQAwCdASogABQAPu1mrE+ppaQiMBgIATAdiWUAxkAPSBtAfWTiw4AA/ujxy7r4E35jIgUq3kD6iqbxWOZxhiXpMuo0AtXhsciWZgnIndqd88idGU1IOKhhVHfgAA==",
        "title": "XP, streaks and 17 badges",
        "body": "Levels, a weekly goal and badges like Quiz ace and Early bird, so learning feels like progress.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "lms-studio",
    "name": "Learning Studio",
    "persona": "HR team",
    "icon": "book",
    "blurb": "Build courses, assign them by rule, run live sessions and issue certificates.",
    "host": "ezerlms.com",
    "steps": [
      {
        "src": "/tour/lms-studio-0.webp",
        "srcSm": "/tour/lms-studio-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAAAQBQCdASogABQAPu1qrFEppaQiqAqpMB2JQBZ0Hhf/AhW379WKkCqWfLkqIPeo44MAAP7y/g8x/df+bUlkY1KWdKJsM74ESskw5DIgaAcivCQ/OIJL9QWbHInZZrC9bxdwliwPFW89gkRehg8cjJjlRXb7cPugxowPFibzXIqT3LXltRbZYi1RtYriheZywc1aAROwcwxhk4BnvoAAAA==",
        "title": "Learning at a glance",
        "body": "Completion, overdue, mandatory compliance and failed attempts, across every company.",
        "act": "click",
        "target": {
          "x": 27.78,
          "y": 38.33,
          "w": 14.58,
          "h": 4.44
        }
      },
      {
        "src": "/tour/lms-studio-1.webp",
        "srcSm": "/tour/lms-studio-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAACQBACdASogABQAPu1mqk8ppaOiKA1RMB2JYgCxDTYF5Usqkt465kCDe8EUOGAA/vL+DzIMN/82pLIxnLVfvBgRcWOb1ar4ReYkWGqwlLzVB1I+v8P/XuwkHP1WV04kbJRHg6oiXfEaiqCc/mO8MjZ2Z/D4ZTS46K4Y8ATa88zxSzTjAk60oi/kFfnziGINjR2ZcmruDg1cepL6OW9HbMDGAAA=",
        "title": "Build courses",
        "body": "Videos, slides, documents and quizzes, drafted, reviewed and published with versions.",
        "act": "click",
        "target": {
          "x": 27.78,
          "y": 43,
          "w": 14.58,
          "h": 4.44
        }
      },
      {
        "src": "/tour/lms-studio-2.webp",
        "srcSm": "/tour/lms-studio-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwBACdASogABQAPt1co02opSMiN/qoARAbiWMAsQdfwFqhcbT9JkBb0QAA/uvnvkEf/DwMSmE3TcKI2q7thj+h8SI9ZkbJSo14Dq667eBk5OqdMJljjW+xaSabzoU8Jj+mVeRqI7uM8N6jXyzkHZfl46kgUWAA",
        "title": "Learning paths",
        "body": "Several courses as one programme, in order or any order, such as a new-joiner path.",
        "act": "click",
        "target": {
          "x": 27.78,
          "y": 55.86,
          "w": 14.58,
          "h": 4.44
        }
      },
      {
        "src": "/tour/lms-studio-3.webp",
        "srcSm": "/tour/lms-studio-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAACQBACdASogABQAPu1krE+ppSQiMBgIATAdiUATpB0P2wIT3sptYIAezqrCUAAA/u8QeGIJX2sf8QNFRL3FkrwhR9N26SZ8LwIuR9GJOFwnoEJi1efZTDJxVYRHxxPsDDf2N7Vjp90+w5Z0jW7GsntbpetfOEhVXRlRRIIliH1FrAxTC+gqUuHDBWL35fMeZS4B04F0NK5kDT45DYAAAA==",
        "title": "Live sessions",
        "body": "Webinars on Zoom, Meet or Teams with invitations, reminders, attendance and the recording.",
        "act": "click",
        "target": {
          "x": 27.78,
          "y": 87.06,
          "w": 14.58,
          "h": 4.44
        }
      },
      {
        "src": "/tour/lms-studio-4.webp",
        "srcSm": "/tour/lms-studio-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAABwBACdASogABQAPt1ao02opSMiN/qoARAbiWMAzPCK//gLVC2qzuGXBOTzCAD+6+e+QR/6x4QZ5kobWWCCNP8DH150n6HVmDWyzWF6zP5WtQCX/943brE+wgawok+YdxRYxUMIe5hVtVtPjjHup6kLkwegewAA",
        "title": "Certificates that verify",
        "body": "Every certificate has a number, a score, an expiry and a verification code.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "insights",
    "name": "Dashboard & analytics",
    "persona": "HR team",
    "icon": "chart",
    "blurb": "The whole group on one screen, and an AI briefing that reads the month for you.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/insights-0.webp",
        "srcSm": "/tour/insights-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAwBQCdASogABQAPu1gqU2ppSQiMBgMATAdiWMAt7gQN+zVRodCURg/jkhKXKKiEqJjgAD+Vgd07Vq+FzJ1syp/U7k5CxPWcYkqoSEauGTjTPtVago3qCv2ei4IQRpw3NoH/xxRPCMypYhVocerbhYdef1BXbpk4MqGdIOSc+NqB3MAAAA=",
        "title": "Where HR starts the day",
        "body": "Headcount across every company and location, hiring in motion, and who is celebrating this week.",
        "act": "click",
        "target": {
          "x": 7.53,
          "y": 20.07,
          "w": 7.43,
          "h": 2.25
        }
      },
      {
        "src": "/tour/insights-1.webp",
        "srcSm": "/tour/insights-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAAAQBQCdASogABQAPu1cq04ppKQiMBgMATAdiWUAsOwR6B3l7Nzac9dHEPWaBttaosgAAP6yDz05RgfF1BGDPKzcQc+iK5SoV4mTEIfcj0j8qxfyi90r6ARc3IBVpY5Cd/qT38OmlE8WqViDfb2DEQKRfGF5PindftS/fqM76gQe51QP4gAAAA==",
        "title": "Nine numbers, each with a “Why?”",
        "body": "Slice by period, company, department, location and employment type.",
        "act": "click",
        "target": {
          "x": 72.31,
          "y": 28.58,
          "w": 6.48,
          "h": 4.39
        }
      },
      {
        "src": "/tour/insights-2.webp",
        "srcSm": "/tour/insights-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAABwBQCdASogABQAPu1sr1CppiQiqAqpMB2JQBOkKcD/AM3mAdJOwdUqzoBr36V66dFQskIAAP6yDz05RgfF1BGDPKzcQc+YEeF5fQnYCOMiLHh9RQFcLTnsK4esJyTkpiEHxLZXn7EctSxDp0SDhk0ktsgCiJkUeQKDpaLibIMb5FJPm3wlRAdQxVWM4M+Z6o7i1y7j2bFedVRtCdvHmajbTBij37pI7A5x4WZ5WgAAAA==",
        "title": "Pay and cost",
        "body": "Cost to company, gross and net, employer contributions and every deduction head.",
        "act": "click",
        "target": {
          "x": 66.66,
          "y": 28.58,
          "w": 4.42,
          "h": 4.39
        }
      },
      {
        "src": "/tour/insights-3.webp",
        "srcSm": "/tour/insights-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAAAQBQCdASogABQAPu1urlIppiQiqAgBMB2JQBb3AkTYW7fWZJsf1L6XSVt9Xm/+7ZUwAP6yDz05RgfF1BGDPKzcQln29etdUA0+nGKdUCl0boREWPD6kQY65hFzmZeWQoHQ5l7h3FhlQABVyqiJ3/3Yi3itVa8+klCGBi+5gTBLmHKilyuqlyuVW3Kccz0NHeSODb0bAFFnvOi8WA3gAA==",
        "title": "Funnel and sources",
        "body": "Which stage loses candidates, and which sources actually produce offers.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/insights-4.webp",
        "srcSm": "/tour/insights-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABQBQCdASogABQAPu1mrE+ppSQiMBgIATAdiWUAzBwR6B4hCkg0tfboxuvREikCoB12sXwA/rIPPTmLEQ4JgSPpUS+n+7KVQWSs9Vr51vv+JXprXxYUGuwsm0wzohqsUOXSjD/8DxvUQf3QVBV5GQ+o+GVLntMXmIRpd8j1YUWONCMYmB9ARIRgjXUeBkwAAAA=",
        "title": "An AI executive briefing",
        "body": "What changed, the likely causes, and three things to do, each with an owner and a deadline.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "hire",
    "name": "Hire & onboard",
    "persona": "HR team",
    "icon": "briefcase",
    "blurb": "Run from the HR team’s own login: requisitions, the pipeline, joiners and e-signed letters.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/hire-0.webp",
        "srcSm": "/tour/hire-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQBACdASogABQAPulgo02pJaMiMAwBIB0JZQC+wCP/lj+j5K/c/7yOuNegAP7T65Z3j2vAr3VePDkdckvqFiQKF09bCApqJCEmFLSH4avtX98eY0zz88rMDFVB1140VmJ/uPJquoKjvV4AAAA=",
        "title": "HR works from its own login",
        "body": "The HR team uses the same self-service as everyone else, with a Manage bar on top for the work their role allows.",
        "act": "click",
        "target": {
          "x": 26.77,
          "y": 9.67,
          "w": 5.69,
          "h": 3.56
        }
      },
      {
        "src": "/tour/hire-1.webp",
        "srcSm": "/tour/hire-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAABwBACdASogABQAPulgo02pJaMiMAwBIB0JZQC+wCPtsGYFF+ykThykonHNQAD+0+uWd49rwLDa3tOO1RRJCZiL3N+G6ppeKHmtmZKt6bCxKWLkowI6RwrsGzEknUMJ/uIWAXBTvpHagAAA",
        "title": "People work, one menu away",
        "body": "Recruitment, onboarding, letters, transfers and performance, shown only to the roles that hold them.",
        "act": "click",
        "target": {
          "x": 28.55,
          "y": 14.6,
          "w": 5.08,
          "h": 2.08
        }
      },
      {
        "src": "/tour/hire-2.webp",
        "srcSm": "/tour/hire-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAADQBACdASogABQAPu1sq06ppqOiMBgIATAdiWcAuDAQ7+AIOJWx/ROz1PZlve06QAD+7ZeXea7OlSme8b9XBPmNpN3UWzSu6RbwU24omZdoF4H+jRzd+5ISzT3CPrfFC1XplBmzRBxlJY9abg7Qlgweq0Xxlu3TyD1hxNEoOhBPJk6BPWDKcRDQAAA=",
        "title": "Hiring at a glance",
        "body": "Requisitions, open roles, the pipeline by stage and the most overdue item first, for the companies this person can see.",
        "act": "click",
        "target": {
          "x": 39.2,
          "y": 22.67,
          "w": 1.76,
          "h": 1.53
        }
      },
      {
        "src": "/tour/hire-3.webp",
        "srcSm": "/tour/hire-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAABwBQCdASogABQAPu1qrVCppaQiqAqpMB2JZwC7ABEh+QX655FN56+9FiShrMnselIgWYoAAP7tmbFJTKJhDnz6QLf4ZTcZgIVG4/ujNj7BvSLjNf81N+x0OlRmSoPDvHnk+dslSBDvFgC5ZJFVtCNaAjqjuThipmPFBR6Wmq/dIyMEyPfIq4AA",
        "title": "Requisitions with sign-off",
        "body": "Quick hire or a full MRF with budget and approvers, flagged the day its target date passes.",
        "act": "click",
        "target": {
          "x": 91.39,
          "y": 22.67,
          "w": 4.45,
          "h": 1.53
        }
      },
      {
        "src": "/tour/hire-4.webp",
        "srcSm": "/tour/hire-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACwBACdASogABQAPu1kqk+ppSOiMBgIATAdiWcAxgQ0b/07yIi7nDv5h1r94mPMAP7yB+Y4fWh04s56hwXZDJ9ysOkJ71v/c/ML5hhwmLcQYYcVoHRmZQFyWUohWFVOhBVDgAAA",
        "title": "Is hiring keeping up?",
        "body": "Fill rate, breached and at-risk requisitions and days to fill, exportable for the Monday review.",
        "act": "click",
        "target": {
          "x": 26.8,
          "y": 9.67,
          "w": 5.74,
          "h": 3.56
        }
      },
      {
        "src": "/tour/hire-5.webp",
        "srcSm": "/tour/hire-5-sm.webp",
        "lqip": "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACQBACdASogABQAPu1kqk+ppSOiMBgIATAdiWdf9leZG3/+CYE3iGMcpF3ZCgAA/vFDhQNThHnQ7u9ljFzw8D3CGl54IoMSYob62xKDZStrM2cRXxFvsL2CFFxCnAHftgAAAA==",
        "title": "From offer to joiner",
        "body": "Once the offer is accepted, the candidate moves into onboarding from the same menu.",
        "act": "click",
        "target": {
          "x": 28.43,
          "y": 18.46,
          "w": 4.84,
          "h": 2.08
        }
      },
      {
        "src": "/tour/hire-6.webp",
        "srcSm": "/tour/hire-6-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAACQBACdASogABQAPu1kqk2ppaQiMAgBMB2JQBjoP/wIC9sq3zbh/1mDOFS3LwAA/u2W59bXnIwtl8IwAI0fTiLnP+ws0v29HjGluAvotzgpD3hmtsTyMraQPAKTBTY9lYGq2EHDAgd93t8S04AAAA==",
        "title": "Every joiner, tracked",
        "body": "Onboarding links in one click, and joinings that are drifting are flagged by AI with the reason.",
        "act": "click",
        "target": {
          "x": 67.33,
          "y": 25.81,
          "w": 8.91,
          "h": 4
        }
      },
      {
        "src": "/tour/hire-7.webp",
        "srcSm": "/tour/hire-7-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAABwBACdASogABQAPu1sq08ppqOiMBgIATAdiWcAyrQVRJdXOFdoQqzpHsxbgAD+8E8I8x0VUn+2phwo8VYNG5GRRsVSjU3PBSE/ymiKyVNhOhifAAA=",
        "title": "PF forms and paperwork",
        "body": "Form 11, Form 2, bank, policy, laptop, ID card and background check, per joiner.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/hire-8.webp",
        "srcSm": "/tour/hire-8-sm.webp",
        "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAwCdASogABQAPu1kqU2ppaOiMAgBMB2JZwDM0C8vrkIxOAD+8E8GBJeYqy/+fvDLegbmDniwq2gKutLCQpPq0yAAAA==",
        "title": "Letters, signed online",
        "body": "Offer letters, joining forms and policies signed with an e-mail OTP, sealed with an audit certificate.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "pay",
    "name": "Pay & claims",
    "persona": "HR team",
    "icon": "wallet",
    "blurb": "Claims checked by AI, a CTC that respects the law, and pay the employee can read.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/pay-0.webp",
        "srcSm": "/tour/pay-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQBACdASogABQAPulgo02pJaMiMAwBIB0JZQC+wCP/lj+j5K/c/7yOuNegAP7T65Z3j2vAr3VePDkdckvqFiQKF09bCApqJCEmFLSH4avtX98eY0zz88rMDFVB1140VmJ/uPJquoKjvV4AAAA=",
        "title": "Money, from the same login",
        "body": "Payroll, Finance, flexi and travel claims sit under Money for whoever holds the role.",
        "act": "click",
        "target": {
          "x": 43.81,
          "y": 9.67,
          "w": 5.66,
          "h": 3.56
        }
      },
      {
        "src": "/tour/pay-1.webp",
        "srcSm": "/tour/pay-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAQBACdASogABQAPuleo02pJSMiMAwBIB0JZQC+wCP/lT9sxw+KuPP4AAD+0+uWd49rwK91Xjw5HMaxouVhcCAS/7t8JpeKHmvAkRyWQsSli5Ko5byCYJgmwN+TGQHAcj6xKGzEta0gJtIQAAA=",
        "title": "Every pay task in one menu",
        "body": "Payroll, Finance approvals, flexi claims, travel claims and loans, each behind its own permission.",
        "act": "click",
        "target": {
          "x": 45.47,
          "y": 22.32,
          "w": 4.82,
          "h": 2.08
        }
      },
      {
        "src": "/tour/pay-2.webp",
        "srcSm": "/tour/pay-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAwAwCdASogABQAPu1wsFKppiSiqAgBMB2JZ2o3WukKkBwAAP7wT3wjHiO+sfVK09wi/Y7sw0wMCPox5FVkO6dhu5EQAA==",
        "title": "Bills, read by AI first",
        "body": "Each bill is checked against the claim, so the reviewer starts with the ones that do not match.",
        "act": "click",
        "target": {
          "x": 37.22,
          "y": 25.53,
          "w": 5.9,
          "h": 4.39
        }
      },
      {
        "src": "/tour/pay-3.webp",
        "srcSm": "/tour/pay-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAgCdASogABQAPu1ur1IppiQiqAgBMB2JaQAAQnlDAAD+8DIVUIW+lGd4DrtjzbhGQ87tG0B+UInETfSGBX2GgAA=",
        "title": "A window that runs itself",
        "body": "Bills open from the 1st to the 20th, then close for payroll, with no reminder email needed.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/pay-4.webp",
        "srcSm": "/tour/pay-4-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAACwBACdASogABQAPu1cqk4ppKQiMBgMATAdiWIAvkg1f+p+iax0ttCY/Bod/pcAAP7zoaZP17LaHV1PJ7V2QjsYxRp1S/zboQgYEQdWzNgihE22lgfKyLHBme0eoHfAEWJM4rYhpyn7iR5jrxioJNTROV8oLtgP4AA=",
        "title": "Build a compliant CTC",
        "body": "Minimum wage, the EPF ceiling, metro HRA, gratuity and statutory bonus applied as the offer is built.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/pay-5.webp",
        "srcSm": "/tour/pay-5-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwBACdASogABQAPu1wsFIppiSiqAgBMB2JZ2c1WXYHZeh9KT6TwlLMGgAA/uraP7Pa8ciqPR9po821IgFL3huG6qQMoPxtOEpDVqCRFS7Q1URrOI4OaCUPZA4CQAAA",
        "title": "Employees see their pay",
        "body": "Their own salary structure, flexi benefits and tax under both regimes, before they declare anything.",
        "act": "click",
        "target": {
          "x": 58.54,
          "y": 25.67,
          "w": 7.59,
          "h": 3.78
        }
      },
      {
        "src": "/tour/pay-6.webp",
        "srcSm": "/tour/pay-6-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAACwAwCdASogABQAPu1ur1IppiQiqAgBMB2JZ2j8VEkHZeh3t4eeAAD+6to/s9rxyKo9H2mi1Rv2HwhPpHcK7ACRzCRiIr1O7hrkFEVC3ySMgt6wlz7Mwjz7ywAAAA==",
        "title": "Voluntary PF, on a slider",
        "body": "Pick a percentage and see the effect on in-hand pay and the 80C limit straight away.",
        "act": "click",
        "target": {
          "x": 73.46,
          "y": 25.67,
          "w": 4.65,
          "h": 3.78
        }
      },
      {
        "src": "/tour/pay-7.webp",
        "srcSm": "/tour/pay-7-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAABQBACdASogABQAPtVYok2oJaMiN+gBABqJZQDGBC1bo98qPLErGtixrG7gAP7wCpcX4PAxVfBhBDfbk5kY+U/0SoKAQPAXRqWWkxJTCoCIBhARwpXlpOKway/YFEx9v3AVgAAA",
        "title": "Loans, applied for in the app",
        "body": "Type, amount, tenure and an indicative EMI, routed for approval with the documents attached.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "engage",
    "name": "Culture & community",
    "persona": "Employee",
    "icon": "heart",
    "blurb": "Recognition people can see, a desk for every question, and a five-minute break.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/engage-0.webp",
        "srcSm": "/tour/engage-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABwBACdASogABQAPu1qqU8ppiOiMBgIATAdiWVZ8leZB2X3zZMysrYHgxkkjAD+6to/l9mG73rR2DjSlBVKC5bT2fPftgcG/IGzElmMkOgIZZBK1SDvfO/1vE1YIIElZAIlI0JYsWX0YQ3AAAA=",
        "title": "The Wall of Fame",
        "body": "Shoutouts on the wall or a private note, with birthdays, anniversaries and new joiners alongside.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 87.4,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/engage-1.webp",
        "srcSm": "/tour/engage-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRtQAAABXRUJQVlA4IMgAAACQBQCdASogABQAPu1mqk+ppSOiMBgIATAdiWIAwrKDN1tIxMl9HPazJJ+yshJ6d3xqsGc/wAD+6tww1E8jgYIL1B/bMXiitCJLUpo/DC/zhVrENfYBhnivku6GYjAhw8v0nd5sqDWBzqgJ2DMdwx1Uh0hpQRAWN+ri5WLz07AZu/Hg+xqcb4o9BEGMldsQHDpnOAT+ibIeNG3lnYluy9SgQMBVeLCi7AhSt4tT7IdCZLfB1LgJPhDxL2Y3+b35//haRHqiCvAAAA==",
        "title": "Fourteen games",
        "body": "Trivia, memory match, spin the wheel and more. Three can be played live against a colleague.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 53.9,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/engage-2.webp",
        "srcSm": "/tour/engage-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASogABQAPu1irFAppSQisBgIATAdiWdrLFrpCTzHMZfPAAD+8DR0D0TDXYjeyVadt1jU2tMvjPJfKNi0BgFVsmbRuXNDBuU0s+iaWiyAAAA=",
        "title": "The whole company, mapped",
        "body": "Search anyone, see who they report to, and who reports to them.",
        "act": "click",
        "target": {
          "x": 10.17,
          "y": 70.65,
          "w": 12.29,
          "h": 2.25
        }
      },
      {
        "src": "/tour/engage-3.webp",
        "srcSm": "/tour/engage-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACQAwCdASogABQAPu1wr1IppiQiqAgBMB2JZQDH5BI2YAmrfVmAAP7q1nJPemsmbeo78g+i5w66pvYmOg5lb3C24Sr1fFPrhrt4tMOqXuF4WoinFAj6vcgYR9qWjTua/qOO/YoQAAA=",
        "title": "Letters on request",
        "body": "Experience, address-proof and salary letters requested and issued without a ticket.",
        "act": "none",
        "target": null
      }
    ]
  },
  {
    "id": "setup",
    "name": "Set up & control",
    "persona": "HR team",
    "icon": "shield",
    "blurb": "A guided company setup, roles down to the screen, and bulk upload from Excel.",
    "host": "app.ezerhrms.com",
    "steps": [
      {
        "src": "/tour/setup-0.webp",
        "srcSm": "/tour/setup-0-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABwBACdASogABQAPu1kqE2ppaOiMBgMATAdiWMAsOwQN+yf6Nqb1uG0ZBjHAAD+0+UCrZ/WWX7rHBjbtHWGD8uGTrJCoj4c8C7PqxNlrXWSJ/00EM65vZz/TxJaUgD9NcAsKVrjeWXrMrvs6gQmryN9WDYRjExQcAA=",
        "title": "Seven guided steps",
        "body": "Companies, locations, departments, policies and payroll settings, in the order they are needed.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/setup-1.webp",
        "srcSm": "/tour/setup-1-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADwAwCdASogABQAPu1iqk2ppaQiMBgMATAdiWUAs4AWGJ7fdk+EyAKAAP7vljoS/9tra7KWqqqLzDExXer/XHCP8o6AOl/6z6a3j5Tiho9tAsXmnVLSqLEQomWZRHpaae8IDUP/QP5VyV9sukC/h4lIQAQAAA==",
        "title": "Bring your Excel",
        "body": "Employees, salaries, leave balances and history uploaded with row-level checks.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/setup-2.webp",
        "srcSm": "/tour/setup-2-sm.webp",
        "lqip": "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAACQBACdASogABQAPu1oqk8ppiOmsBgIATAdiWMAyJgREf6rwS1oo0+o1j7ldgAA/tPlAdHu6X6gUKnekN56JNVSVLph/Zt6kGY/zGVoIJd46EKXnH4T4el9h4pq8j2La6yHi/xoJkeq3prYZ8IzAAAA",
        "title": "Roles down to the screen",
        "body": "Who can see which company, which module and which action, set per role.",
        "act": "none",
        "target": null
      },
      {
        "src": "/tour/setup-3.webp",
        "srcSm": "/tour/setup-3-sm.webp",
        "lqip": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAACQBACdASogABQAPu1mqk2ppaQiMAgBMB2JZQC/7CBv21SQU3TeB+I068qsnYAA/tPlAqzDVjCSwajvinDmCl0bnyNpInjXwBRiR1t4AycOzAbRxepEt0MtCPsZh+XH3P7XKggpiNPIZfcCoGCAs3e6IERAAA==",
        "title": "Letters, emails, notifications",
        "body": "Every template and every alert is yours to word, per company.",
        "act": "none",
        "target": null
      }
    ]
  }
]

export const phoneScreens: PhoneScreen[] = [
  {
    "id": "m-home",
    "title": "Home",
    "caption": "Punch in, leave balance, quick actions and the team, on one scroll.",
    "src": "/tour/m/m-home.webp",
    "nav": "/tour/m/m-home-nav.webp",
    "ratio": 6.6667,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRmIDAABXRUJQVlA4IFYDAABwEgCdASogANUAPu1urlIppiQipvVboTAdiUAZO7QGFtqgA3r7NZhwNSSRrvdLAou8TWGPV8ggmwvK97isZSAqGYXO4+wHeHWNfOoCIhgij0rig9BhrG1s+OmBI44s1r1/P6gPKexTKsfLu1ws76qEl1XkJhIHegT8hMEjjNryc3gixxn4Tk3RfYlO85wLE7Lgp/3ao77S5ISH0AAA/vUSSyyuCh3uD4Poemo0SUIYRSEBd3S3xceEXUiu5n6GsrL0XtY9potXaTD45JBQwDtRWQeyIW4G8BVi6NhkD02emeDf/wDDV49gISt8Lh2E/kAvlYHB3CpjDuunCgMoxjLYPFo/hXW1rMNIsQDkUHpnmayZ5a+8ZF25hj4225TO2Qyy3WQ3Sfh8mOPW7acWLb8gsXEahQOWRc4Zg4+nhIoJXKH3lsLGu8aZTml+2AqXj6SefhVrBpZYPZURQM1QDZ5kEwogbhTFsG0cH0ONI70KL37mMCF9Qj+5lQJGRNUUmkNAS/cHsXQrzZks7v3uG5Kx0AEpqvZxOYEG3O/2+mq/6jXS8DgiW61mIUyDaST9nrZPtQi2/ocspzYuXNHLqAKHmewxXSlRiU90VAnhYp6V4lgSmdNu42KXrzsgm6M5fRjfjmgRFOPmhfpA9CiETmbkUJaBu4XJPkTG7gOAckxRwxpoOA5seKRwedFB3g0drggMBrf0cvbA7hcajMOe0FOru2kqy0+UtUxF83g07pDfEcQAix09bPL2diSo/+DJ9FaF3EIIlEc0EnYFQ84JS3jnZpSSm2Zse9UfRmLu03e3lG9jezZJdkaCzmHOOnvoaWEYeUYiGL2hrmGvd8u45gwjlgMufmxbnxtIDofMQU6qLutYRf3PJ56Av0CaUjeWo9g9PeITVcPr7lvIlwwuiKRIZfi1cRooQHysYV5ouUCB8Y3SWoXc7Azz2QJX8kwNWcK43mrOV8WWsZpDGaL66njSGrsPX6K7rKoMFhFqTiImyhsABnUl6xcnIRSdIF82lx5hO6aq97gUuBoggAHRaiBdQ3cNZnxg6AwMJ9a5dDWsDKNuWtbKWfz9yC/4TFsQntBTl++W8RMlc37yDeO2FTH3AKAhsFk4/+Pak3lrzZb6jA+nIu6AAA=="
  },
  {
    "id": "m-leave",
    "title": "Leave",
    "caption": "Balances by type, the calendar and the request, in a few taps.",
    "src": "/tour/m/m-leave.webp",
    "nav": "/tour/m/m-leave-nav.webp",
    "ratio": 5.0615,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRvABAABXRUJQVlA4IOQBAABQDACdASogAKIAPu1wrFEppqQiqjSaqTAdiWcYf6fArdo24BYYntisr7l6E/coQWpzkRPJGgoVQeeQBIKPDVTqoRuQfVU2ONwJut+MTaPORf0q5eoZrgoZRJw1M0rH5tr5/xjpDUfiFMJNcAD+7dfAn4WP8nXJmKw0HnP+qG4lhA5Cs8vMdDTxNtrSA/eaSXNupgcgquEqXAQaLoFtITG/YW/ZmZsDoCSUNCakcoKrc4VsOgfbVCNfbjhCQi4iodZFYsBlSWWSoZM1Dd/lY+eWpfaxj4YAvT4VIeNUb7l+LHwHooc3LPyMW6ggW9umcpgb0vp1iDwTtfNBOijNeq6uW3DPE6DOa0IijjzBgG1pckJhrTHoOAgId+ycoLkKit1JulexV6yTdDg47a07/kJwlqQJZkdJpKMgpJ48oHXAQAT/6BSHJmpsLxCFhZTV7fHSz/pWQXgMeFsF4kyw6YmGml4P1q3aEcdddDaAhb4JdeGFonmA61fqA7suWoneA8H3CDB4HoWe5r2JSNljgudcON/ZMfAlG/2NutOZjX7dWuavt7qzMFWK3MBy45vo8OcNrtp8UZh6Uo6814wW/4FzuzEeW6CEF5Ei2oCFS8SH/8TMrqUQOF3GSgAoXLAyvwNP6egA"
  },
  {
    "id": "m-attendance",
    "title": "Attendance",
    "caption": "The month in colour, with overtime and loss of pay counted.",
    "src": "/tour/m/m-attendance.webp",
    "nav": "/tour/m/m-attendance-nav.webp",
    "ratio": 4.0821,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRhgCAABXRUJQVlA4IAwCAADwCwCdASogAIMAPtlepE2oJaOiM5udsQAbCUOAAc6lxtQDeRl/Puw+ExyFS/73VFyyYaKRAbG5+xYUUfLYatAsI0at3L3Y2RovwqZPyFOeXJJmSbxfHDdsyMrxGbput8r7IbNBwhU8AAD+8i4wHbq3QJaLTY5YhsFXNlh1+1UOjWxD0258EmgXPyYwVZ0RzW+M5dFqa2FkHQ+XpZuosFo4Z5qKVnkVNTWzEvvc3kFKdPVfxOLYnMbzio82tEHIt0uotA3IHADzkePxpLpbY56Nl3r4Bo5n3cFm06rxcAPowXZN6Yhls+JC/P4G1GkmpcC11G4tGRRh/sdOICX3WRAVeKJlEJlMWwcSH0EZ92fa37JgyRit7U8DnZqbqle7ZUbt1dHeFiq726vfBgy6X++oBMjj2OOtXmGfWA7yhnpyo/YKAgjuF5AOnQOTxZq98mEEeiA3d0apt9DAXNfaOrGHMH6eAhgY5u3imz0yho9d8aCJqGhjEB6oDHyuMefApq5W8tuoqMTb2jdehSxrUIIm3e4e+FOPh7LxIR3GZrIl+JQ3WNwNKfwJgdtup0cSC25fctT/P5Ab7lNbBJX2BHNNEptxt+KVK5E+VW40Y8D40qQUXsZScm2i67Rvpx4ik/NBIxOyLc009NvSumQiOng2uilfhnfohjOJlLnBqp3xg/Pc0+aUfBjWcAAAAA=="
  },
  {
    "id": "m-performance",
    "title": "Performance",
    "caption": "Seven stages, the deadline, and what is owed next.",
    "src": "/tour/m/m-performance.webp",
    "nav": "/tour/m/m-performance-nav.webp",
    "ratio": 6.6667,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRuIDAABXRUJQVlA4INYDAADwFQCdASogANUAPu1iqU2ppaQiMTd7ETAdiWQcAA37vBPr/wuNnt3ueA04qVT1CfA2zqzEK+Xm7qvBan7/uF/Tzf5q3/toDa19qvMHEtbxDva27evNgPyKaXycxPhLaGrzsqAbfYb1pk0tMWdj/oV5zw0uUC5NAgjvEfXO26F2vprgo3kaDVNRiZQn6X7SGWoKa+YhPIaUpL3coECufLivEOVbyq8GfRarQcTDG3up/J4z8+YTXMGAAP7t2R5ByoVGV5SoxWKqDYVldAiC3IBNoRlLuQzjKaAMu3RFx0x+hPNe1zQ62mKWHtxblYFfhLfGwOKtlSGhvxGpP3HpfD8G7qPx4jy5zcDNwgWojd8rPDB/4dwBr9n2OqvakudVv4dgRAJl7L5tDGPL/2PcWDiWoiMffVCsYsKDpMUTN6q16RF1wvFzJ+C56VErVZRliuFLVT/PTqgd7O4QjGqsuhk19ds/BXK3b9MHotqNDSRMW0tTo3+XVnYGVKSBi2v1RuLIvNKOV5OLGSpiWMCGquFYt4lGAjROF1GiNpsZAHIgLpS0icKED0Ey0eeK7Hf62vZOBc5nT2uScc9joEgG42O/vaJIbFw91Wccuai/bGwVs3tfVlp0EaK1as2N0EAHjrdLtsCIf2hKdIHlV+8WOL8FI2iarj47sCOdefvCRTCUt9qVhue68HG2Tzr+shPBCCVOHiwOqJkXrHBOhlj5K6isqD2pQbmBNh+Kr+ZO9JulPc5s0qlk0bXrw25A/MTqNhoVVEX2ki3Dr9BG7fLgZS0Iworqy41RNHQi7RytL9kjXHeigWlUgw87ydc3R445wENPvucVVIzG4tc/vJgEnPzbV6oT45xg0VGNx77XHreg/qgE42ou3M0UI6G4zl4PNEIkJw6nCvJY5+DVvEH4tAEzLPzqyR29gwtHy/3y8HhSUW4zyZPgmPcFQHolrZz+iMjFuoA5jwn8EmDnREiVPEz9+QHQf1B4b4TM/Wtk4Qdq+Ev2c+pm6GnET5vol7CQjweIGBIhtiHoxcpOym1Mbqvi4t0tGwiE+mCWxBGAi+kJdOuu6Cl4NtQ5g3k+QhdgcYJlBqlGrorihrXozC1M9fv5vWqBfnawcb04hqQHWBBfZ/TjEv612RhBOGfbPViRj8R5NB76RuZfquq0A7ZKAsSlCGd4QZ0WIFDBJtBbC3/7I9Gdm4PUIK9mjx+p2CYo0xwgY2qdZguNFEJyhDp9kt1v6MuGycjtVQe/w4sSFvcuip2FEOAaxiE9KowswoNPqoovhedfpe1T7iHxGKmysuAiFrIAFMgA"
  },
  {
    "id": "m-lms",
    "title": "EZER Learn",
    "caption": "Courses picked for their role, with streaks and a weekly goal.",
    "src": "/tour/m/m-lms.webp",
    "nav": "/tour/m/m-lms-nav.webp",
    "ratio": 6.6667,
    "navRatio": 0.1641,
    "lqip": "data:image/webp;base64,UklGRtADAABXRUJQVlA4IMQDAABQFQCdASogANUAPu1yrlApp6Qiq3ZpyTAdiWMAz8HESNYVI5PH1X90oe3bnLeh1iVNdY5sl5e8GFo8GgnkJxxFCuDSpP86liBk/hEelKuQD0dlDdw27EDGpZcjXOwtJGGkKaVhWd/XvsNbmSX/BN8/fIus/i/wFEFrpy8OYMZRfcIqHj8oyD9Ryerk7IXRHr2Ty2rKBXtM3Tajw+qIZa6yFwG4bjv/mSrchKTfp5xm0HGVAAD+9j4JkQbqAiEjPbsKyed8bNBd8a3QA5Hik87+TV1rtEKf+zwOkTssRW8Kcn2mBlt6vxSIv7434F3+UwkIZWjKfPdWzZhTN6Ocar1Oafn1AOAZZG908r3ILwDThhiFC3X8FAx4289IF7kgGU1wf9hMr9ohTZq2l5LaR3x2NYZalKKno9E0zWcyCwhhx6tn9vSwWBykQTnD88m/An6TOH7ZVrcUo3+k4IgXZQqehlQ2zmd/Xdq+ymf412NR4zbsYKZTWowZtsnLA+78Mk9fad5n09b4vTcD20KQAjeE/tW6mWA2viNXbx8opSlAFxZMmrEoPqhB3HYI08EloSyznwfVzLzFSJrogtzpJ3nbVACwkDjfx355ebhdILqm6HBwIZmIA4htMsXSexNLJzFlRQQi4HDacvQ03GKbkyPgIo77vTjM3B7+hu7oCpfutfTNvUcD+T39B9AXkqtBS3dd3FKbo42VRe5WplYPP2k7jRuRdF/JC95wQjNA69cyN2WJf21/lsGJ/fCNCc3pJuhoCiw5HSlMXF5nCltCwo/xDP/OVgBmMmN7EhEnyaxX0Ykb8EtvfuppeJ64h7UDP08aI0HrPnwRU783pravdUbzUPej/NoVH4RQKWV2fOVvbFDEd2/oCfOMFofwEtnRDe9KJWyzSlEqb14sezufNQe3dcWVzTZ5Q5DUMhdYERGN3jlqs02m4Q1O7ZBomkBQs6YDbUBfmUixv+pE7d3oA+EQrHI8gFRN4LhK7J0p/7WWQb/Ll9xw8QUTyUMNR9HOT/R+b5mqxEmsneegiVPb02utjvHbOmjTfP4/F5zJ0eo1qqAfkFRWeWD34N+zjbqKafsQuskBJO6vPs7jijzjlYKrsnPN8RUzudfkgu3g3meoVmiqQkUK8uHtoYtdumYDd9DIg2SyqQwrsVZLtoiwEtwRlL5iWpw6NpDrlgTHQ/cbfhF14AUwPeulxF3rODFWBiWLwYVCQPLExPYiuaT+pQNf8lS+uyyOnSRwUQsPIHCqsrthG+rBjiniys3DFdCKiDzUOwAA"
  },
  {
    "id": "m-achievements",
    "title": "Achievements",
    "caption": "Levels, XP and seventeen badges to earn.",
    "src": "/tour/m/m-achievements.webp",
    "nav": "/tour/m/m-achievements-nav.webp",
    "ratio": 6.6667,
    "navRatio": 0.1641,
    "lqip": "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAACQDQCdASogANUAPu1urVKppiQipJgMqTAdiWljT7qVQLHpz73GWHMsoq98wKlbnZOjvW/91AlnAqoyAUAdMPogc87kbGTz5A+Nj2d5HSGhRXPpM5UHnxQIrUtq4VGLI4q5udukxfy6eGBxHWW92pdCefpwrAAA/u/Iyh4ZP0djyIU9RvgREj2l8EqOTSYa5QIiCiHug3dVauiBGbdTe7CJXP1a8wLWtyywt10q7qUQYwjceb6Czhs8tXbIWV0WI2SBZodrUIEld6q1BrfDjDrQ5CBj5SAOLZ5nky65Xzr//tGcEzvtMYlNhNfwlPpzTt6dXGKwUIBpYdZ35Lz5WTc0BYwo3Fu6l+DHzsCoXMl86mRApnTWv4Q46QD62VsVS76hMWKg9aJqxO9CT4jlEPJWd/vfjkOe1HaFUgmnYjw0whvWzaPNQqxq+WWBeOyGND/r0fKMmeV9WN8gYfC+QdLMeBLYa81K8qz/Sk47ZFGzcaPt4cZRPkIGmwXOWAq3AxWnyQ3xU1ct6fPjAHREEKmkSXUS3MByhhh1fnFPcsW1vgAn9Y2ar4ifEuP0WGdfXbfKqzTwFWnmyl8xFcj7SQVSkwW3YNdx044Os22QrxT8+RgbAmkCDFrnzdLafmgZgV53kVVX8aMQyADUHTGAUdnWlc2JNBy7USBqSnuEQADACkVIeWvf/iL2yk1PQgXgXKV3htWzRYRKa94F5Vr9RTjJZE5QmCQdjrTeGGH7wEwAAA=="
  },
  {
    "id": "m-social",
    "title": "Wall of Fame",
    "caption": "Shoutouts and private notes, with the most-recognised podium.",
    "src": "/tour/m/m-social.webp",
    "nav": "/tour/m/m-social-nav.webp",
    "ratio": 6.6667,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRoQCAABXRUJQVlA4IHgCAADQEQCdASogANUAPu10sVQppqQjISrxMB2JZwDVClQ+DsbJefdle5wUtQNVLRVUlg1VKecc80huVgNkRgD2BHRJBX+YvvfuOlryZ5hs5Ncs6WCScYz0fvZ5wKbsyQhahMPrzrjJ8qdxaodiOt/4jZF8R1/R0U5YQh0wRv2dS7/SD4hPlk05Wpu5bfqJRR79ch/KsfGNxqgAAP7zu/x4fCidoZtI6x9ciaR5tV54SsDzVTx9WWFbmYgtg91hOhEraPAT3hI/2znFr5b8MRJs4n7fVmBsB1/FwbHOEd9poCxz6/PIzZtDbh0wRyOO/cUqbVxRDpASAlIwK9003pQaoXKXu+pPVTNZ4GHVJA5i4g3dAofOmySlkak4WBDCXJfVHvFOMYkLjiaV5viyEni8BjPhU3BYy4zGDWTg734WAh4J6RWnCFVDIgIzIAboL/c2ABHcpc6/enQw5x2sP0uvl8Od1GG0MXmjWvu3WaTj30uQVoEawnwr7F/KIG3a98RDiJO895jyrevcrmAKM+PCdnW6OqH58xh+JTWM06T1u5sH6yeQk1AcsQDXQibNe2y3FpTWuAbYzA/WF+dv8rTN0F+wimiY85T3smfhVubVHPG3RJ75CRv44OStqEb76EtyC1WOtTa/b46peqxeuzGZiJ7lB+tB/cbmwCsqCsPwlALQDcHuXERkTxUvUficZuwNlLByWF+6DvlI4IYY6E9Mvi7Gp24rF5dXnhaWmMhtYzKLNJGynQ6Ph+VG7v6shGgQ/RIZFe+Ra+EhPQX+G+IDiDT/mYbZpexR6zhNCJIdqai5/JHyemfOShvLDFWPczZKVmjwlKFq8IgAAA=="
  },
  {
    "id": "m-funzone",
    "title": "Fun Zone",
    "caption": "Fourteen games for a five-minute break.",
    "src": "/tour/m/m-funzone.webp",
    "nav": "/tour/m/m-funzone-nav.webp",
    "ratio": 5.6949,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRroDAABXRUJQVlA4IK4DAABwEwCdASogALYAPtVap02oJaQiNVgN+QAaiWIAyFS4gOfhc7NKn4K8ebdbc2JlzGEkiXFL4wX94pJqSI8mowLYho6mnFl2kFKdIpsfMKyV2Eo2Yq1TynzDSdRicNvC0juI8u9w729Hvv4F2Z8mkt6YxmNnGGOkG6JnLRtBi/VgvzHYIjAGJykjpCzm93A98r8LqWiPSHdkVBxXoSsjsUrNeXNqAAD+8iibENgwZHuZ5qlOtS+XoU53Mfb330m38nkD8UZzEUSbzPbouRmrZlOssETOtNcw3ZO77S4Tu3s+Qy0OyeL3zGiagp2JEVjtEQyEBxhZG9mQGwElRLxF7w+xysVnGm7k4fsD1FMYz38SEnd8YacNd2CiztHrfLVrwyIkmORF40Uw0u73YCgAkpDlOPEUNUHcnJ0kYPrbvrgepzivn06POGM4bA77MedqCQrSfq8JmFqAVNKSwS1tfgksIhfc5Ufnf/9JDynqNaBUGv7z15l/lrhJ3Q2Amerl+p4hyEHi0xlrSU513Hhql6p+uWAnc2pmc5DR8fPmioh+pUm1Otq9K7KZkINyp7FUbwDgkuMHQV6ghJfh+bBS/Z2ySdDP2ya8e0j9JD+2Aguw51u0QgyKlIfSIzbI51tpDQiCgQgJbVRvX1WT+WY4G0Fy2ejgyam2UfhcAteMV6mVB8fcF55AVrebQjY+rPdsgBvqQDf5leYPncZAVoxV0cZApfxJOkDEjrE3u6Mh/cy2TQgXcvVVThVVHq839p5lViktzFRt7ZP4HAvjDAnYDkMRK6B8crjU1/bGiwEHlllMPFT1Dknhoz6uZHxYM6qpKCDxtjOKxz0/X2t+MiuWS2aHg0a6lh5On/YX5Kjpk33gG0c5rlDZ5BNaKnZ/UalBiHj5UFAhfBITOmSMn/4rqHgfpuLGxx1k1bsJh8AEEoIzdRwR/Jho6UofJRzv36WSjcFcrXr1tcNz6Kbt0HvLqVgW8cVa7Zb3OBhDRQXPqMBwtgo/B0304lny4h5d/ClfVze/Y9b7V4HoCXM0rs+6UkdqnKVA+UkITVTD+JDLSv0sJ9mmE1LuF77mYDw1MP6nE4wJVvVxLOHLKDWmb18b+4/hvfHVQS3kkl9oKsyiRUOIutFTP6o8DYR1WPWd6maDO9gNXe8DKP1Z68uItYmqjC2MGfApQ0T+vnTsWzBfHgJLAZ89UkwTu3zWzVWKnFjUoGMuPG3F7nc4q21uh6HvghJABm7hVaQZZT8++tMAAAA="
  },
  {
    "id": "m-insights",
    "title": "Insights",
    "caption": "Their own month, written in three lines by AI.",
    "src": "/tour/m/m-insights.webp",
    "nav": "/tour/m/m-insights-nav.webp",
    "ratio": 6.6667,
    "navRatio": 0.1718,
    "lqip": "data:image/webp;base64,UklGRnoDAABXRUJQVlA4IG4DAADwFACdASogANUAPu1qq0+ppiOiKlVdCTAdiUAZjzZ5Gtujz4emwLIh2a4H+DV5vETtUGggAXE4XRlDujhPmw8PjmcygbN3opmzbZ7jDl2C7qWWVWhsFlb6F9gS5ttdC106fI8Kz/+QY6DDxZucvbU0MBZ0YUjDJM5fmFwCCDxA1GWl/g38QGT3BxP6WX9SSCr77XuWOWi7iEm8fHcfP6Gz4/O4ahAkFcpMj1NLVHT/SgD+9jzQ+CCWsPLI8junvLdRErBv2ZgtqJsCB6UY6LQdgAi/5vjKeN52/xmBH+P2i+A7eH1W8mtFaPnYyZEnja5eegNYNaL9Y9psVPLrihQZyPIawwfu2EUm/uNOSZ5GkvZOCAC/yc0ERY/0ZK86iudyfBWgDQUWlZsqixLiVT1eFsvGB0cENtbAJw4ET2U/v9m4zOaMwx2gfUH2+JiO4cG4PgWH0sDliGr3x/qsUDgucw5j8yL/5MopfSxSPXnG0fj5Q4lQFt0D05WuAhy3GwlkxFyZZKpj1cf5CUT3+3QXqwrzLZd3o3fS8gAlIBcHZCbvmxkBIkOmWYO2KJZcWMKYwvHgl+tXu4NiaMmUhsI9Pb1oSvUBwS6ugbwAKfddUMm/OSgOFw1ME7MWPaVmbNwsuI/sEaA4dxlXD/WEw6pblD5PXCopLOeFz64LDraT1HZ7nOcoX3fIg/NO/4N1R+Ce8b802OeQEjRx1EhSO/i6c5T+U1Ud5DEix0SJ8EGAMz3ytDIzVaYmsnpl1Zel1Tn9m8/Y6rq4NVlEgXQZPjNN6oSuvcOhpCooYqR5/G5nO/NuAL6foG1JOAOyp4aIi5H8XFdqj3P/XfIb2LY1D6HbWIGtpJbvlezZhsQxwa4rrDBHFamyv9fuTT1TBJV/686zgmO69ByqeS89uPhzKLPkQOFuKOjMkKCu9vQvfXKLn89hrJUqU0MrFKL/8MjpkDwb/N+//RGBVd1Zx1tQmjGGAuXzUHld4Mmk1J4HUBxehYjeXKF8wfopwDMsMVaykwysD4A8iBGh7pa+TyuaM6wRxkiIU/FPtEkCJIILu7YXc1rcNlOUjt1vnT6wRts+GI2OirAbTugLoQPijXVqcrvnOUIhZirEQ2mXHEa8cY8NkQyHB6oEft63Bw4MSThKrJBZMXwL9V0AT9ph2QAAAA=="
  }
]

export const demoStepCount = demoFlows.reduce((n, f) => n + f.steps.length, 0)
