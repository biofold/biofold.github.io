library(RColorBrewer)
args = commandArgs(trailingOnly=TRUE)
infile<-args[1]
outfile<-args[2]


# Read Table From File
evaluations<-read.table(infile,header=T)
pdf(outfile, width = 15, height = 5)

# Calculate Mean and Standard Error
n<-17
vector=0*c(1:n)
std=0*c(1:n)
for (i in 1:n) {
vector[i]<-mean(evaluations[,i][!is.na(evaluations[,i])])
std[i]<-sd(evaluations[,i][!is.na(evaluations[,i])])
}

# Make BarPlot
nice <- brewer.pal(3, "Pastel2")
par(mfrow = c(1, 2), mgp=c(2,0.75,0))
bp <- barplot(vector,  names=c(1:17),  ylim=c(1,4), xlab="Question", ylab="Mean (score)", col=nice[3], las=1, axes=FALSE, xpd=FALSE)
axis(side = 1, at = bp, labels = FALSE)
axis(side = 2, at=seq(1,4,1), las=1) 

box()
mids <- bp[, 1]
print (vector)
print (std)
for (i in 1:n){
arrows(x0 = mids[i], y0 = vector[i] - std[i], x1 = mids[i], y1 = vector[i] + std[i], code = 3, angle = 90, length=0.05)
}

# Make BoxPlot
bop<-boxplot(evaluations, col=nice[1], ylim=c(1,4), xlab="Question", ylab="score", names=c(1:n), las=1, axes=FALSE, xpd=FALSE)
axis(side = 1, at = seq(1,17,1) )
axis(side = 2 ,at=seq(1,4,1), las=1)
box()
dev.off()
