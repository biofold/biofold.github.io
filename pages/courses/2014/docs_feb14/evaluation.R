library(RColorBrewer)

# Read Table From File
evaluations<-read.table("evaluation201402.txt",header=T)
pdf("evaluation201402.pdf", width = 11, height = 5)

# Calculate Mean and Standard Error
vector=0*c(1:10)
std=0*c(1:10)
for (i in 1:10) {
vector[i]<-mean(evaluations[,i][!is.na(evaluations[,i])])
std[i]<-sd(evaluations[,i][!is.na(evaluations[,i])])
}

# Make BarPlot
nice <- brewer.pal(3, "Pastel2")
par(mfrow = c(1, 2), mgp=c(2,0.75,0))
bp <- barplot(vector, ylim=c(0,10), names=c(1:10), xlab="Question", ylab="Mean (score)",  col=nice[3], las=1)
axis(side = 1, at = bp, labels = FALSE) 

box()
mids <- bp[, 1]
for (i in 1:10){
arrows(x0 = mids[i], y0 = vector[i] - std[i], x1 = mids[i], y1 = vector[i] + std[i], code = 3, angle = 90, length=0.05)
}

# Make BoxPlot
boxplot(evaluations, col=nice[1], ylim=c(0,10), xlab="Question", ylab="score", names=c(1:10), las=1)
box()
dev.off()

