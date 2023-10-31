import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { Session, getServerSession } from "next-auth";
import { db } from "@/db";
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const session: Session | null = await getServerSession();
    if (!session) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Session not found.",
      });
    }
    const { user } = session;
    if (!user?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User has no e-mail associated with their profile.",
      });
    }
    const dbUser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
    }
    return { success: true };
  }),
  splash: publicProcedure.query(() => {
    const splashTextArray = [
      "Where every lesson is a light bulb moment!",
      "Making every minute in the classroom count!",
      "Your one-stop lesson planning workshop!",
      "Crafted for the modern educator!",
      "Brewing a storm of ideas for your next lesson!",
      "Because every subject deserves a master plan!",
      "Putting a spotlight on structured learning!",
      "Less scrambling, more teaching!",
      "Education's backstage pass!",
      "Where your teaching journey begins!",
      "Crafting the future, one lesson at a time!",
      "Where preparation meets opportunity!",
      "Your blueprint for educational success!",
      "Turning the page to a new chapter of teaching!",
      "Every lesson's backstage crew!",
      "Teaching made less puzzling!",
      "No educator is an island with our collaborative features!",
      "Your lesson, your canvas!",
      "Sculpting the architects of tomorrow!",
      "Lesson planning: The unsung hero of education!",
      "Strategize, Organize, Educate!",
      "Elevate your teaching game!",
      "Less guesswork, more teamwork!",
      "Your co-pilot in the journey of education!",
      "Where every subject shines!",
      "Building bridges between teachers and learners!",
      "Classroom magic begins here!",
      "Education's dream workshop!",
      "Less planning time, more 'Aha!' moments!",
      "Making every class a masterclass!",
      "Now with more lesson plans than ever!",
      "Making the grade, one plan at a time!",
      "Putting the 'class' in 'classroom'!",
      "Markdown: Because plain text was too mainstream.",
      "File attachments included, presentations not guaranteed!",
      "Group projects: Where 'we' means 'you'!",
      "Sharing is caring, especially among educators!",
      "Now supporting all coffee-fueled late night planning sessions!",
      "Now with 100% more structured knowledge delivery!",
      "Customizable lesson blocks: Because not all classrooms are created equal!",
      "Your lesson, your rules!",
      "Where every lesson plan is a potential masterpiece!",
      "Helping you stay on plan, one tick at a time!",
      "Keeping your lessons on point and your coffee hot!",
      "Now with fewer chalkboard screeches!",
      "One small step for a lesson plan, one giant leap for education!",
      "Make every lesson count!",
      "Fail to plan, plan to fail. We can help with the first part!",
      "The more you plan, the less you improv!",
      "Putting the 'able' in 'educatable'!",
    ];
    const emojiArray = [
      "📝",
      "📖",
      "📚",
      "🎓",
      "👩‍🏫",
      "👨‍🎓",
      "👩‍🎓",
      "👥",
      "🔄",
      "⏱️",
      "📊",
      "📋",
      "✏️",
      "💾",
      "📂",
      "🔗",
      "📤",
      "📥",
      "🖊️",
      "📌",
      "😃",
      "😄",
      "🥳",
      "🎉",
      "🎊",
      "🎈",
      "🎁",
    ];
    const randomEmojis = emojiArray.sort(() => 0.5 - Math.random()).slice(0, 3);
    return `${
      splashTextArray[Math.floor(Math.random() * splashTextArray.length)]
    } ${randomEmojis.join("")}`;
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;